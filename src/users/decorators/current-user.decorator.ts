import { createParamDecorator,ExecutionContext } from "@nestjs/common";

// creating decorator for geting value from interceptor
export const CurrentUser = createParamDecorator(
    (data:never, context:ExecutionContext)=>{
        const request = context.switchToHttp().getRequest();
        console.log("this is sesssion",request.session)
        return request.currentUser;
    }
)
