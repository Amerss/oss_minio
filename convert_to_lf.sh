#!/bin/bash

# 检查是否安装了dos2unix命令
if ! command -v dos2unix &> /dev/null; then
    echo "The 'dos2unix' command is not available. Please install it."
    echo "To install 'dos2unix' on Ubuntu/Debian, run: sudo apt-get install dos2unix"
    echo "To install 'dos2unix' on CentOS/RHEL, run: sudo yum install dos2unix"
    exit 1
fi

# 查找当前目录及其子目录中的所有文件并使用dos2unix命令格式化这些文件
find . -type f -exec dos2unix {} +

echo "Conversion to LF format completed."