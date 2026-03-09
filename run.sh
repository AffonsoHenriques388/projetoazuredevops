#!/bin/bash

properties=canaldenuncia.properties

msg_err()
{
	echo ""
	echo "${1}"
	[ "${2}" ] && echo "${2}"
	echo ""
	exit 1
}

run_container()
{
 echo ""
 echo "Executa o conteiner: ${image}"
 echo "docker run
--restart=always
--name ${name}
-p ${ports_1}
-d ${image}"
docker run \
  --restart=always \
  --name ${name} \
  -p ${ports_1} \
  -d ${image} 
  echo "`ip a`"
  echo ""
  echo ""
  echo "Acesse através do IP do WSL:8080 (Interface eth*)"
  echo ""
  echo ""
}

stop_container()
{
  echo ""
  echo "Parando o conteiner: ${image}"
  echo "docker container stop ${name}"
  docker container stop ${name}
}

remove_container()
{
  echo ""
  echo "Removendo o conteiner: ${image}"
  echo "docker container rm -f ${name}"
  docker container rm -f ${name}
}

start_container()
{
  echo ""
  echo "Inicia a imagem: ${image}"
  echo "docker start ${name}"
  docker start ${name}
}

logs_container()
{
 echo ""
 echo "--------------------------------------------------------------------------------------"
 echo "Log de execucao do container: ${name}"
 echo "docker logs ${name}"
 docker logs ${name}
}

[ -f ${properties} ] || msg_err "Esse script precisa do arquivo de configuracoes '${properties}' no diretorio."
source ${properties}

option="restart"
[ "${1}" ] && option="${1}"

case ${option} in
  "run") run_container;;
  "stop") stop_container;;
  "remove") remove_container;;
  "start") start_container;;
  "restart") stop_container; remove_container; run_container;;
  "logs") logs_container;;
  *) msg_err "Opcao desconhecida: ${option}" "Opcoes disponiveis: run, stop, remove, start e restart (default)";;
esac

echo ""

