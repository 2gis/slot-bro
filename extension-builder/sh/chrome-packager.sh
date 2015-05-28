#!/bin/bash -e

usage () {
    echo "Usage: "
    echo "./packager --version 1.2.1.1234 --sourcedir ./build-dir/output/chrome --cert ./build-dir/cert/chrome.pem --outputbase ./build-dir/output/myextension"
}

while [ "$1" != "" ]; do
    case $1 in
        -v | --version )        shift
                                VERSION=$1
                                ;;
        -s | --sourcedir )      shift
                                SOURCE_DIR=$1
                                ;;
        -c | --cert )           shift
                                CERT_FILE=$1
                                ;;
        -o | --outputbase )     shift
                                OUTPUT_BASE=$1
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

OUTPUT_BASE="$OUTPUT_BASE$VERSION"
OUTPUT_CRX="$OUTPUT_BASE.crx"
TMP_OUTPUT_PUBKEY="$OUTPUT_BASE.pub"
TMP_OUTPUT_SIGNATURE="$OUTPUT_BASE.sig"
TMP_OUTPUT_HEADER="$OUTPUT_BASE.header"
OUTPUT_ZIP_WEBSTORE="${OUTPUT_BASE}_chrome_webstore.zip"
TMP_ZIP="${OUTPUT_BASE}_chrome.zip"

make_chrome_webstore_package () {
    cd "$SOURCE_DIR"
    cp manifest.json ../manifest.json.bak
    cat manifest.json | grep -v 'update_url' > manifest.json.1
    mv manifest.json.1 manifest.json
    zip -qr -9 -X "$OUTPUT_ZIP_WEBSTORE" .
    mv ../manifest.json.bak manifest.json
}

byte_swap () {
  # Take "abcdefgh" and return it as "ghefcdab"
  echo "${1:6:2}${1:4:2}${1:2:2}${1:0:2}"
}

make_tmp_zip () {
    cd "$SOURCE_DIR"
    zip -qr -9 -X "$TMP_ZIP" .
}

make_crx () {
    # generate signature
    openssl sha1 -sha1 -binary -sign "$CERT_FILE" < "$TMP_ZIP" > "$TMP_OUTPUT_SIGNATURE"
    # generate public key
    openssl rsa -pubout -outform DER < "$CERT_FILE" > "$TMP_OUTPUT_PUBKEY" 2>/dev/null
    # generate file header
    crmagic_hex="4372 3234" # Cr24
    version_hex="0200 0000" # 2
    pub_len_hex=$(byte_swap $(printf '%08x\n' $(ls -l "$TMP_OUTPUT_PUBKEY" | awk '{print $5}')))
    sig_len_hex=$(byte_swap $(printf '%08x\n' $(ls -l "$TMP_OUTPUT_SIGNATURE" | awk '{print $5}')))
    printf "$crmagic_hex $version_hex $pub_len_hex $sig_len_hex" | xxd -r -p > "$TMP_OUTPUT_HEADER"
    cat "$TMP_OUTPUT_HEADER" "$TMP_OUTPUT_PUBKEY" "$TMP_OUTPUT_SIGNATURE" "$TMP_ZIP" > "$OUTPUT_CRX"
}

cleanup () {
    trap 'rm -f "$TMP_OUTPUT_PUBKEY" "$TMP_OUTPUT_HEADER" "$TMP_OUTPUT_SIGNATURE" "$TMP_ZIP"' EXIT
}

cleanup
make_chrome_webstore_package
make_tmp_zip
make_crx
cleanup
