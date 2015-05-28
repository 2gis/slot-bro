#!/bin/bash

usage () {
    echo "Usage: "
    echo "./packager --version 1.2.1.1234 --sourcedir ./build-dir/output/safari --certdir ./build-dir/certs --output ./build-dir/output --filename myextension"
}

while [ "$1" != "" ]; do
    case $1 in
        -v | --version )        shift
                                VERSION=$1
                                ;;
        -s | --sourcedir )      shift
                                SOURCE_DIR=$1
                                ;;
        -c | --certdir )        shift
                                CERT_DIR=$1
                                ;;
        -f | --filename )       shift
                                BASE_FILENAME=$1
                                ;;
        -o | --output )         shift
                                OUTPUT_DIR=$1
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

TMP_EXT_DIR="$OUTPUT_DIR/tmp/safari/${BASE_FILENAME}_$VERSION.safariextension"
OUTPUT_SAFARIEXTZ="$OUTPUT_DIR/$BASE_FILENAME$VERSION.safariextz"
CERT_LIST=`ls "$CERT_DIR"`

get_xar_command() {
	SOURCE="${BASH_SOURCE[0]}"
	while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
	  SCRIPTDIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
	  SOURCE="$(readlink "$SOURCE")"
	  [[ ${SOURCE} != /* ]] && SOURCE="$SCRIPTDIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
	done
	SCRIPTDIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
	SYSNAME="`uname`"
	case ${SYSNAME} in
		'Darwin')
			echo "${SCRIPTDIR}/mac/xar"
			;;
		*)
			echo "${SCRIPTDIR}/linux/xar"
			;;
	esac
}
XAR_CMD=`get_xar_command`

make_safariextz () {
    cp ${CERT_DIR}/* ${OUTPUT_DIR}
    cd ${OUTPUT_DIR}
    ${XAR_CMD} -czf ${OUTPUT_SAFARIEXTZ} --distribution ${TMP_EXT_DIR} > /dev/null 2>&1
    ${XAR_CMD} --sign -f ${OUTPUT_SAFARIEXTZ} --digestinfo-to-sign digest.dat --sig-size 256 --cert-loc ./cert.der --cert-loc ./cert01 --cert-loc ./cert02
    openssl rsautl -sign -inkey ./key.pem -in ./digest.dat -out ./sig.dat
    ${XAR_CMD} --inject-sig ./sig.dat -f ${OUTPUT_SAFARIEXTZ}
    rm -f sig.dat digest.dat
    echo ${CERT_LIST} | xargs rm
}

make_safariextz
