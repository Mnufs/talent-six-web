const constant = {
}

//判断环境
if(process.env.NODE_ENV == "development"){
  constant.API_ENV = "http://localhost:19999";
} else {
  constant.API_ENV = "http://localhost:19999";
}


export default constant
