import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: any) { 
    try {
        const { host, port, secure, username, password } = await request.json();
        const newSetting = await prisma.mailSetting.upsert({
            where: {
              username: 'arina@codetisan.com',
              
            },
            update: {
                host,
                port,
                secure,
                username,
                password,
            },
            create: {
                host,
                port,
                secure,
                username,
                password,
            },
          })
        // const newSetting = await prisma.mailSetting.create({
        //     data: {
        //         host: "smtp.gmail.com",
        //         port: 587,
        //         secure: true,
        //         username: "nabihahnadzri@gmail.com",
        //         password: "bhwf sxvs pwsq rgap",
        //     },
        //   })
        console.log(newSetting);
        const allSettings = await prisma.mailSetting.findMany();
        console.log(allSettings);
        return Response.json({ newSetting, allSettings });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Failed saving settings' });
    }
}

