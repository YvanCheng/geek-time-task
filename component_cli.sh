#!/bin/bash

CMD=$1;

status=$(git status|grep 'working tree clean')
if [ "$status" == '' ]; then
  echo "Git working tree is not clean, please commit at first."
  exit 1
fi
if [ "$CMD" == 'init' ]; then
  echo "Starting init component git repository......"
  git subtree add --prefix=component https://git.cisdigital.cn/platform-developer/fe/fe-poseidon-module-component.git master --squash
  if test [ $? -ne 0 ]; then
    echo "add subtree error."
    exit 1
  fi
  echo "Add component origin"
  git remote add -f component https://git.cisdigital.cn/platform-developer/fe/fe-poseidon-module-component.git
  if test [ $? -ne 0 ]; then
      echo "add origin error."
      exit 1
    fi
elif [ "$CMD" == 'pull' ]; then
  echo "Starting pull......"
  git subtree pull --prefix=component component master --squash
elif [ "$CMD" == 'push' ]; then
  echo "Starting push......"
  echo "pulling"
  git subtree pull --prefix=component component master --squash
  echo "pushing"
  git subtree push --prefix=component component master
else
  echo "Command not supported."
fi
