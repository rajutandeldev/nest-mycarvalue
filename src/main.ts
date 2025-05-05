import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
const cookieSession =require("cookie-session") ;

async function bootstrap() {
  const logger = new Logger();
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    name: 'session',
    keys: ['askjljfdsf'],
    maxAge: 24 * 60 * 60 * 1000,  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  
  app.use((req,res,next)=>{
    console.log(`req.session `,req.session)
    next()
  })
  logger.verbose(`---- Application is running on port ${port} -----`);
  await app.listen(process.env.PORT ?? port);
}
bootstrap();
