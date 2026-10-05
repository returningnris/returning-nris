import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import QRCode from 'qrcode'

const require = createRequire(import.meta.url)
const source = ts.transpileModule(readFileSync(new URL('../lib/halloween-scanner.ts',import.meta.url),'utf8'), {
  compilerOptions: {module:ts.ModuleKind.CommonJS},
}).outputText
const raw = 'https://example.com/events/halloween/ticket#'+'a'.repeat(64)

function frame(width=720,height=405) {
  const qr=QRCode.create(raw,{errorCorrectionLevel:'M'}).modules
  const cell=Math.floor(Math.min(width,height)/(qr.size+8))
  const data=new Uint8ClampedArray(width*height*4).fill(255)
  const left=Math.floor((width-qr.size*cell)/2),top=Math.floor((height-qr.size*cell)/2)
  for(let y=0;y<qr.size*cell;y++) for(let x=0;x<qr.size*cell;x++) {
    if(qr.data[Math.floor(y/cell)*qr.size+Math.floor(x/cell)]) {
      const pixel=((top+y)*width+left+x)*4
      data[pixel]=data[pixel+1]=data[pixel+2]=0
    }
  }
  return {data,width,height}
}

function reader(API) {
  const mod={exports:{}},canvas={width:0,height:0}
  let decoderLoads=0
  canvas.getContext=()=>({drawImage:()=>{},getImageData:()=>frame(canvas.width,canvas.height)})
  vm.runInNewContext(source,{module:mod,exports:mod.exports,window:{BarcodeDetector:API},document:{createElement:()=>canvas},
    require:name=>{ assert.equal(name,'jsqr');decoderLoads++;return require(name) }})
  return {read:mod.exports.createHalloweenQrReader(),canvas,loads:()=>decoderLoads}
}

test('portable scanner decodes a real family QR without BarcodeDetector and bounds camera resolution',async()=>{
  const scanner=reader()
  assert.equal(scanner.loads(),0)
  const video={readyState:2,videoWidth:1920,videoHeight:1080}
  assert.equal(await scanner.read(video),raw)
  assert.equal(scanner.canvas.width,720);assert.equal(scanner.canvas.height,405)
  assert.equal(await scanner.read(video),raw);assert.equal(scanner.loads(),1)
})
test('native scanning avoids loading the software decoder',async()=>{
  const scanner=reader(class {async detect(){return [{rawValue:raw}]}})
  assert.equal(await scanner.read({readyState:2,videoWidth:720,videoHeight:540}),raw)
  assert.equal(scanner.loads(),0)
})
test('a failing native detector switches to software decoding',async()=>{
  const scanner=reader(class {async detect(){throw new Error('unsupported')}})
  assert.equal(await scanner.read({readyState:2,videoWidth:1920,videoHeight:1080}),raw)
  assert.equal(scanner.loads(),1)
})
test('video frames that are not ready cause no decode work',async()=>{
  const scanner=reader()
  assert.equal(await scanner.read({readyState:0,videoWidth:0,videoHeight:0}),null)
  assert.equal(scanner.loads(),0)
})
