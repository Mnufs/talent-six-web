#!/bin/sh

# 切换镜像地址
npm config set registry https://registry.npm.taobao.org

# 安装所需第三方包
npm install

# 打包
npm run build

# copy项目所需文件
/bin/cp -rf tomcat-conf/WEB-INF/ dist/

# 项目名称
PROJECT_NAME="talent-six-web"

# 创建docker镜像
sudo docker build -t $PROJECT_NAME:latest .

# 停止docker容器服务 && 删除docker容器服务
sudo docker stop $PROJECT_NAME && sudo docker rm $PROJECT_NAME

# 启动docker容器
# -d：后台启动
# -p：设置端口（宿主机对外端口:docker内部端口）
# -name：别名
# --restart=always：docker启动，容器自启动
# -v /talentSix/logs/$PROJECT_NAME:/usr/local/tomcat/logs  挂载日志文件到宿主机
sudo docker run -d -p 8888:8080 --name $PROJECT_NAME --restart=always -v /talentSix/logs/$PROJECT_NAME:/usr/local/tomcat/logs $PROJECT_NAME:latest

# 删除无用的docker镜像
sudo docker images | grep none | awk '{print $3}' | xargs -i sudo docker rmi {}
