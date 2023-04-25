const jwt=require("jsonwebtoken")

const verifye=async (req,res,next)=>{
    const authheader=req.headers.token
    
    if(authheader){
        const token=await authheader.split(" ")[1]
            jwt.verify(token,process.env.JWT_SEC,async(err,payload)=>{
                if(err){
                     res.status(403).send("token is not valid")
            
                }
                req.user= payload
               // console.log(payload)
                next()
            })
    }else{
        return res.status(401).send("you are not authorized")
    }
}
const verifytokenandauthorization=(req,res,next)=>{
    verifye(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).send("you are not allowed")
        }
    })
}
const verifytokenandadmin=(req,res,next)=>{
    verifye(req,res,()=>{
        if( req.user.isAdmin){
            next()
        }else{
            res.status(403).send("you are not allowed")
        }
    })
}
module.exports={verifye, verifytokenandauthorization,verifytokenandadmin}