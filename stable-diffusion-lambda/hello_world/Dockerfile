FROM public.ecr.aws/lambda/python:3.9 as base

RUN python3.9 -m pip install --no-cache-dir \
        diffusers \
        transformers \
        scipy \
        accelerate \
        torch --extra-index-url https://download.pytorch.org/whl/cpu

RUN yum install -y \
        mesa-libGL-devel \
        mesa-libGLU-devel \
        libpng-devel && \
    yum clean all


FROM base as builder

RUN python3.9 -c "from diffusers import StableDiffusionPipeline; \
            model_id = 'stabilityai/stable-diffusion-2-1-base'; \
            model = StableDiffusionPipeline.from_pretrained(model_id); \
            model.save_pretrained('/model');"


FROM base

COPY --from=builder /model /model
COPY app.py ./

# Command can be overwritten by providing a different command in the template directly.
CMD ["app.lambda_handler"]
