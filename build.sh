#!/bin/bash

source canaldenuncia.properties

image_name=${name}
image_tag=`echo ${version} | cut -d- -f1`

echo "#############################################################################"
echo "# Gera a imagem docker customizada da original: ${image_name}:${image_tag} "
echo "#############################################################################"
# apaga a image existente
echo "docker image rm -f ${image_name}:${image_tag}"
docker image rm ${image_name}:${image_tag}

rm -rf dist

npm run build

echo "###########"
echo "docker build -t ${image_name}:${image_tag} ."
echo "###########"
docker buildx build -t ${image_name}:${image_tag} .

