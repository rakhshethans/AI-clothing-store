"""Convert the pinned, MIT-licensed clothing checkpoint locally. No remote inference."""
from pathlib import Path
import os,sys,json,hashlib,tempfile
project=Path(__file__).resolve().parents[1]
source=project/'private-data'/'fashion-detr'
target=project/'public'/'local-recognition'/'models'/'threadline'/'fashion-detr-v1'
sys.path.insert(0,str(project/'private-data'/'recognition-python'))
os.environ['HF_HOME']=str(source/'cache')
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
workspace_temp=project/'private-data'/'recognition-temp'
workspace_temp.mkdir(parents=True,exist_ok=True)
tempfile.tempdir=str(workspace_temp)
with (source/'model.safetensors').open('rb') as handle:
 if hashlib.file_digest(handle,'sha256').hexdigest()!='01f78edc0c0e3abfcf8b09555d04ab5a43216a501bf24559ce5619673c4ce824':
  raise ValueError('Source weights integrity mismatch.')
import torch,transformers,onnx,onnxruntime
from transformers import AutoConfig,AutoModelForObjectDetection
from onnxruntime.quantization import quantize_dynamic,QuantType
torch.set_num_threads(min(6,os.cpu_count() or 1))
config=AutoConfig.from_pretrained(str(source),local_files_only=True)
config.use_pretrained_backbone=False
if list(config.id2label.values())!=['bag','bottom','dress','hat','outer','shoes','top']:
 raise ValueError('Unexpected clothing labels.')
model=AutoModelForObjectDetection.from_pretrained(str(source),config=config,local_files_only=True,use_safetensors=True).eval()
class Export(torch.nn.Module):
 def __init__(self,model):super().__init__();self.model=model
 def forward(self,pixel_values,pixel_mask):
  result=self.model(pixel_values=pixel_values,pixel_mask=pixel_mask,return_dict=True)
  return result.logits,result.pred_boxes
target.joinpath('onnx').mkdir(parents=True,exist_ok=True)
float_model=source/'model.onnx'
print('Converting the local clothing model. No images or API requests are involved.',flush=True)
torch.onnx.export(Export(model),(torch.zeros(1,3,800,1066),torch.ones(1,800,1066,dtype=torch.int64)),str(float_model),input_names=['pixel_values','pixel_mask'],output_names=['logits','pred_boxes'],dynamic_axes={'pixel_values':{0:'batch',2:'height',3:'width'},'pixel_mask':{0:'batch',1:'height',2:'width'},'logits':{0:'batch'},'pred_boxes':{0:'batch'}},opset_version=17,do_constant_folding=True,dynamo=False)
quantize_dynamic(str(float_model),str(target/'onnx'/'model_quantized.onnx'),weight_type=QuantType.QUInt8,per_channel=False,op_types_to_quantize=['MatMul','Gemm'])
(target/'config.json').write_text((source/'config.json').read_text(encoding='utf-8-sig'),encoding='utf-8')
(target/'preprocessor_config.json').write_text((source/'preprocessor_config.json').read_text(encoding='utf-8-sig'),encoding='utf-8')
metadata={'sourceModel':'yainage90/fashion-object-detection','revision':'fb0a4ff27adfe56500ab4d36e2586436eb1d2979','torch':torch.__version__,'transformers':transformers.__version__,'onnx':onnx.__version__,'onnxruntime':onnxruntime.__version__,'opset':17,'quantization':'QUInt8 MatMul/Gemm weights; float32 convolutions'}
(target/'export.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
print('Local clothing model converted.',flush=True)
