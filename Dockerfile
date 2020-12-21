
#基础镜像
FROM ccr.ccs.tencentyun.com/expo/tomcat:8.5.42

#作者
MAINTAINER mnufs

#定义项目目录
ENV PROJECT_PATH /usr/local/tomcat/webapps

#复制项目文件到ROOT下
COPY ./dist/. $PROJECT_PATH/ROOT

#复制文件favicon.ico 到ROOT下
COPY ./tomcat-conf/favicon.ico $PROJECT_PATH/ROOT

#设置时区和时间
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
