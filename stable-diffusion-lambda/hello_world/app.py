import base64
import os
from PIL import Image
from io import BytesIO

from diffusers import StableDiffusionImg2ImgPipeline

pipe = StableDiffusionImg2ImgPipeline.from_pretrained('/model')
pipe = pipe.to('cpu')


def lambda_handler(event, context):

    width = int(os.environ['WIDTH'])
    height = int(os.environ['HEIGHT'])
    strength = float(os.environ['STRENGTH'])
    guidance_scale = float(os.environ['GUIDANCE_SCALE'])
    prompt = os.environ['PROMPT']
    print(prompt)

    if (not 'body' in event) or (event['body'] == ''):
        return {
            'message': 'body is empty'
        }

    output_filename = '/tmp/image.jpg'

    try:
        os.remove(output_filename)
    except:
        pass

    img_bin = base64.b64decode(event['body'])
    init_image = Image.open(BytesIO(img_bin))

    try:
        convert_image = {
            1: lambda img: img,
            # 左右反転
            2: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT),
            # 180度回転
            3: lambda img: img.transpose(Image.ROTATE_180),
            # 上下反転
            4: lambda img: img.transpose(Image.FLIP_TOP_BOTTOM),
            # 左右反転＆反時計回りに90度回転
            5: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT).transpose(Image.ROTATE_90),
            # 反時計回りに270度回転
            6: lambda img: img.transpose(Image.ROTATE_270),
            # 左右反転＆反時計回りに270度回転
            7: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT).transpose(Image.ROTATE_270),
            # 反時計回りに90度回転
            8: lambda img: img.transpose(Image.ROTATE_90),
        }

        exif = init_image._getexif()
        orientation = exif.get(0x112, 1)
        init_image = convert_image[orientation](init_image)
    except:
        pass

    init_image = init_image..convert('RGB')
    
    init_width = init_image.width
    init_height = init_image.height

    init_image = init_image.resize((width, height))

    image = pipe(prompt,
                 image=init_image,
                 strength=strength,
                 guidance_scale=guidance_scale).images[0]

    image = image.resize((init_width, init_height))
    image.save(output_filename)

    with open(output_filename, 'rb') as f:
        base64_img = base64.b64encode(f.read()).decode('utf-8')

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "image/jpeg"},
        "body": base64_img,
        "isBase64Encoded": True
    }
