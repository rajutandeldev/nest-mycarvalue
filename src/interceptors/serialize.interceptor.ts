import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import {  Observable } from "rxjs";
import {map} from 'rxjs/operators'
import { UserDto } from "src/users/dto/UserDtos";

// restric user to pass the argument which should be only class

interface classContructor{
    new (...args:any[]): {}
}

export function Serialize(dto:classContructor){
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto:any){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>  {
        // Run something before a request is handled
        // by the request handler
        console.log('Im running before the handler', context)
        return next.handle().pipe(
            map((data:any)=>{
                // Run something before the resonse is sent out 
                console.log('Im running before response is sent out', data)
                return plainToClass(this.dto,data, {
                    excludeExtraneousValues:true
                })
            })
        )
    }
}

