import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../../lib/prisma';
import Error from 'next/error';

cloudinary.config({
    cloud_name: 'ditqvgwyd',
    api_key: '898767255852921',
    api_secret: 'Afqh8m1O_n3kq1W0b4jUzttfm1U',
});

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        const filename = uuidv4();

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                data.file,
                { public_id: filename },
                async function (error, result) {
                    console.log(result);
                    if (error || !result) {
                        resolve(
                            NextResponse.json({
                                status: 400,
                                message: error?.message,
                            }),
                        );
                    } else {
                        let path = result.url.replace(/^.*[\\/]/, '');

                        let metadata = {
                            width: result.width,
                            height: result.height,
                            bytes: result.bytes,
                            asset_id: result.asset_id,
                            public_id: result.public_id,
                        };

                        let file = await prisma.file.create({
                            data: {
                                path: path,
                                fullUrl: result.url,
                                metadata: metadata,
                                format: result.format,
                                resourceType: result.resource_type,
                            },
                        });

                        resolve(
                            NextResponse.json({
                                status: 200,
                                message: 'File uploaded successfully',
                                data: file,
                            }),
                        );
                    }
                },
            );
        });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error?.stack });
    }
}
