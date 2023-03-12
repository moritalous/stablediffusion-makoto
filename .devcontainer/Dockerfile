FROM mcr.microsoft.com/devcontainers/base:focal

RUN curl -L "https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip"  -o "aws-sam-cli-linux-x86_64.zip" && \
    unzip aws-sam-cli-linux-x86_64.zip -d sam-installation && \
    ./sam-installation/install && \
    rm -rf aws-sam-cli-linux-x86_64.zip ./sam-installation
