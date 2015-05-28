#!/bin/bash -e

usage () {
    echo "Usage: "
    echo "./packager --version 1.2.1.1234 --sourcedir ./build-dir/output/firefox --outputbase ./build-dir/output/myextension"
}

while [ "$1" != "" ]; do
    case $1 in
        -v | --version )        shift
                                VERSION=$1
                                ;;
        -s | --sourcedir )      shift
                                SOURCE_DIR=$1
                                ;;
        -o | --outputbase )     shift
                                OUTPUT_BASE=$1
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

make_zip () {
    cd "$SOURCE_DIR"
    zip -qr -9 -X "$TMP_ZIP" .
}

OUTPUT_BASE="$OUTPUT_BASE$VERSION"
OUTPUT_XPI="$OUTPUT_BASE.xpi"
TMP_ZIP="${OUTPUT_BASE}.zip"

make_zip
mv "$TMP_ZIP" "$OUTPUT_XPI"
