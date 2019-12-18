import VUE from 'vue';
import FS from "fs";
import BOOTSTRAP_EMAIL from 'bootstrap-email';
import { createRenderer } from 'vue-server-renderer';

export function renderEmail(file_name, email_data){
  return new Promise((resolve, reject)=>{
    var file_path = './campaigns/'+file_name+'.html';
    if(FS.existsSync(file_path)){
      var app = new VUE({
        data: email_data,
        template: FS.readFileSync(file_path, 'utf-8')
      })
      createRenderer().renderToString(app, (err, vue_render)=>{
        if(err){
          reject('Error at Vue compiler'+err)
        }else{
          try{
            const template = new BOOTSTRAP_EMAIL({
              content: vue_render
            }).compile();
            resolve(template)
          }catch(e){
            reject(e)
          }
        }
      })
    }else{
      reject('Could not find template: ./campaigns/'+file_name+'.mjml')
    }
  })
}
