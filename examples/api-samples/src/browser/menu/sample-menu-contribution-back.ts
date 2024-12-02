// *****************************************************************************
// Copyright (C) 2020 TORO Limited and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { QuickInputService } from '@theia/core/lib/browser';
import {
  Command, CommandContribution, CommandRegistry, MAIN_MENU_BAR,
  MenuContribution, MenuModelRegistry, MenuNode, MessageService, SubMenuOptions
} from '@theia/core/lib/common';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';
import { MonacoEditorProvider } from '@theia/monaco/lib/browser/monaco-editor-provider';
import URI from '@theia/core/lib/common/uri';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { CommandLineOptions } from '@theia/process/lib/common/shell-command-builder';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { FileDialogService } from '@theia/filesystem/lib/browser';
import { RequestService } from '@theia/core/shared/@theia/request';

import { TerminalWidgetOptions } from '@theia/terminal/lib/browser/base/terminal-widget';

export interface Pipeline {
  duration: string;
  name: string;
  status: string;
}

export interface DidCreateNewResourceEvent {
  uri: URI
  parent: URI
}
export const DEFAULT_HTTP_OPTIONS = {
  method: 'POST',
  headers: {
    Accept: 'application/octet-stream'
  },
};
const MakeCommand: Command = {
  id: 'make-command',
  label: 'Make Command'
};
const InitProjectDirectory: Command = {
  id: 'init-project-directory',
  label: 'Init Project directory'
};
// sub sub menu
const JavaCommand: Command = {
  id: 'java-command',
  label: 'Generate Java Dockerfile'
};
const PythonCommand: Command = {
  id: 'python-command',
  label: 'Generate Python Dockerfile'
};
const GolangCommand: Command = {
  id: 'golang-command',
  label: 'Generate Go Dockerfile'
};

const InitGolangProject: Command = {
  id: 'init-golang-project',
  label: 'Init Go Project'
};

const RunCommand: Command = {
  id: 'run-command',
  label: 'Run Command Menu'
};
const RunJavaCommand: Command = {
  id: 'run-java-command',
  label: 'Run Java'
};
const RunPython3Command: Command = {
  id: 'run-python3-command',
  label: 'Run Python3'
};
const RunGolangCommand: Command = {
  id: 'run-Golang-command',
  label: 'Run Golang'
};

const GenerateYAMLFileCommand: Command = {
  id: 'generatre-yaml-file-command',
  label: 'Generate YAML File'
};

const DockerMenuCommand: Command = {
  id: 'docker-menu-command',
  label: 'Docker Command'
};

const BuildDockerfileCommand: Command = {
  id: 'build-dockerfile-command',
  label: 'Build Dockerfile Command'
};

const runDockerImgCommand: Command = {
  id: 'run-docker-img-command',
  label: 'Run Docker Image Command'
};
const RegistryPushImg: Command = {
  id: 'puah-container-image',
  label: 'Push Container Image'
};

const RegistryPullImg: Command = {
  id: 'pull-container-image',
  label: 'Pull Container Image'
};

const DockerLogin: Command = {
  id: 'docker-login',
  label: 'Docker Login'
};

// const AddNodeandConfigureWorkload: Command = {
//   id: 'add-node-and-configure-workload',
//   label: 'Add Node and Configure Workload'
// };

// const MLPipelineInfoFunc: Command = {
//   id: 'ml-pipeline-info-func',
//   label: 'ML Pipeline Info Func'
// };

// const MLPipelineRunFunc: Command = {
//   id: 'ml-pipeline-run-func',
//   label: 'ML Pipeline Run Func'
// };

const MLPipelineCreateRunFunc: Command = {
  id: 'ml-pipeline-create-run-func',
  label: 'ML Pipeline Create Run Func'
};
@injectable()
export class SampleCommandContribution implements CommandContribution {

  @inject(QuickInputService)
  protected readonly quickInputService: QuickInputService;

  @inject(MessageService)
  protected readonly messageService: MessageService;

  @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;

  @inject(MonacoEditorProvider) protected readonly monacoEditorProvider: MonacoEditorProvider;

  @inject(FileService) protected readonly fileService: FileService;

  @inject(WindowService)
  protected readonly windowService: WindowService;
  protected doOpenExternalLink = (url: string) => this.windowService.openNewWindow(url, { external: true });

  @inject(TerminalService) protected readonly terminalService: TerminalService;
  @inject(FileDialogService) protected readonly fileDialogService: FileDialogService;
  @inject(RequestService) protected requestService: RequestService;
  // @inject(FileResource) protected readonly fileResource: FileResource;

  // eslint-disable-next-line @typescript-eslint/tslint/config
  protected readJsonFile(fileUri: URI) {
    return this.fileService.read(fileUri);
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config
  protected async parseJsonData(value: string, path: URI) {

    await fetch('http://10.0.2.192:1111/api/v1/yaml', {
      // mode: 'no-cors',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: value
    }).then(response => {
      console.log('ok?: ', response.ok);
      if (!response.ok) {
        console.log('HTTP error', response.status);
      } else {
        const yaml_json = response.json();
        yaml_json.then(data => {
          console.log('data: ', data);
          this.fileService.createFileKetiYaml(JSON.stringify(data), path);
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config
  protected logTable(data: { items: { [key: string]: Pipeline } }, options: TerminalWidgetOptions) {

    // const currentTerminal = this.terminalService.currentTerminal;
    const terminal_test = this.terminalService.lastUsedTerminal;
    terminal_test?.show();

    // eslint-disable-next-line max-len
    let log_text = '+------------------------------------------------+--------------------------------------+---------+\n| 파이프라인 이름                                 | 실행 시간                           | 상태     |\n+------------------------------------------------+--------------------------------------+---------+\n';

    for (const key in data.items) {
      if (data.items.hasOwnProperty(key)) {
        const item = data.items[key];
        log_text += '| ' + item.name.padEnd(22) + '\t\t\t | ' + item.duration.padEnd(14) + '\t\t| ' + item.status.padEnd(7) + '  |\n';
      }
    }

    log_text += '+------------------------------------------------+----------------+---------+\n';
    const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
    const rootUri = firstRootUri.toString().replace('file://', '');
    if (terminal_test !== undefined) {
      const logTables: CommandLineOptions = {
        cwd: rootUri,   // Command실행 경로
        args: ['echo', log_text],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
        env: {}
      };
      terminal_test.executeCommand(logTables);
    }
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config
  protected async mlpInfoAPI() {
    await fetch('http://10.0.2.192:1111/api/v1/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then(response => {
      // console.log('get ml workload info: ', response.json());
      response.json().then(data => {
        console.log('response data: ', data);
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        this.logTable(data, { title: 'logtable', cwd: rootUri, env: {}, useServerTitle: false });
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config
  protected async mlpRunAPI(value: string) {
    await fetch('http://10.0.2.192:1111/api/v1/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: value
    }).then(response => {
      console.log('ok?: ', response.ok);
      if (!response.ok) {
        console.log('HTTP error', response.status);
        alert('ML Workload Has Run Successfully!');
      } else {
        console.log('HTTP Result: ', response.status, ' _ ', response.statusText);
        alert('The ML Workload Run Has Failed!');
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config
  protected async createRunAPI(yamlStr: string, nameStr: string, descriptionStr: string) {
    const bodyData = JSON.stringify({
      // name: value01,
      // describe: value02,
      // base64: btoa(value03)
      yaml: btoa(yamlStr),
      metadata: {
        name: nameStr,
        description: descriptionStr
      }
    });
    console.log('Translate result: ' + JSON.stringify(bodyData));
    await fetch('http://hybrid.strato.co.kr:30121/submit', {
      // await fetch('http://10.0.2.161:30121/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: bodyData
    }).then(response => {
      console.log('ok?: ', response.ok);
      if (!response.ok) {
        console.log('HTTP error', response.status);
        alert('The ML Workload Run Has Failed!');
      } else {
        console.log('HTTP Result: ', response.status, ' _ ', response.statusText);
        alert('ML Workload Has Run Successfully!');
      }
    });
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand({ id: 'create-quick-pick-sample', label: 'Internal QuickPick' }, {
      execute: () => {
        const pick = this.quickInputService.createQuickPick();
        pick.items = [{ label: '1' }, { label: '2' }, { label: '3' }];
        pick.onDidAccept(() => {
          console.log(`accepted: ${pick.selectedItems[0]?.label}`);
          pick.hide();
        });
        pick.show();
      }
    });

    // Java를 실행을 위한 도커파일 예제 생성 메뉴
    commands.registerCommand(JavaCommand, {
      execute: () => {
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        this.fileService.createFileKetiJava(new URI(rootUri + '/Dockerfile'));
      }
    });

    // Python 실행을 위한 도커파일 예제 생성 메뉴
    commands.registerCommand(PythonCommand, {
      execute: () => {
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        this.fileService.createFileKetiPython(new URI(rootUri + '/Dockerfile'));
      }
    });

    // Golang 실행을 위한 도커파일 예제 생성 메뉴
    commands.registerCommand(GolangCommand, {
      execute: () => {
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        this.fileService.createFileKetiGolang(new URI(rootUri + '/Dockerfile'));
      }
    });

    // 현재 열린 디렉토리에 go-lang 프로젝트 구조 생성
    commands.registerCommand(InitGolangProject, {
      execute: () => {
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        alert(rootUri);

        this.fileService.createFolder(new URI(rootUri + '/goProject'));
        this.fileService.createFile(new URI(rootUri + '/goProject/Dockerfile'));
        this.fileService.createFolder(new URI(rootUri + '/goProject/pkg'));
        this.fileService.createFolder(new URI(rootUri + '/goProject/bin'));
        this.fileService.createFolder(new URI(rootUri + '/goProject/src'));
        this.fileService.createFile(new URI(rootUri + '/goProject/src/main.go'));
      }
    });

    // 사용자가 선택한 Java 실행 커멘드 메뉴
    commands.registerCommand(RunJavaCommand, {
      execute: () => {
        this.fileDialogService.showOpenDialog({
          title: RunJavaCommand.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
        }).then((selectUri: URI | undefined) => {
          if (selectUri) {
            const currentTerminal = this.terminalService.currentTerminal;

            if (currentTerminal === undefined) {
              alert('current terminal undefined!');
              return;
            } else {
              // let filePath = selectUri.toString().replace('file://', '');
              const fileFullPath = selectUri.toString();
              const filePathElement = selectUri.toString().split('/');
              // alert('>>>'+ filePath[-1]);
              const filename = filePathElement[filePathElement.length - 1];
              const filePath = fileFullPath.replace(filename, '').replace('file://', '');

              const runJavaCommandLine: CommandLineOptions = {
                cwd: filePath,   // Command실행 경로
                args: ['javac', filename],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                env: {}
              };
              currentTerminal.executeCommand(runJavaCommandLine);
              const runJavaCommandLine2: CommandLineOptions = {
                cwd: filePath,   // Command실행 경로
                args: ['java', filename.replace('.java', '')],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                env: {}
              };
              currentTerminal.executeCommand(runJavaCommandLine2);
            }
          } else {
            alert('Not Select file!');
          }
        });
      }
    });

    // 사용자가 선택한 Python 실행 커멘드 메뉴
    commands.registerCommand(RunPython3Command, {
      execute: () => {
        this.fileDialogService.showOpenDialog({
          title: RunPython3Command.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
        }).then((selectUri: URI | undefined) => {
          if (selectUri) {
            const currentTerminal = this.terminalService.currentTerminal;
            if (currentTerminal === undefined) {
              alert('current terminal undefined!');
              return;
            } else {
              const fileFullPath = selectUri.toString();
              const filePathElement = selectUri.toString().split('/');
              const filename = filePathElement[filePathElement.length - 1];
              const filePath = fileFullPath.replace(filename, '').replace('file://', '');

              const runPythonCommandLine: CommandLineOptions = {
                cwd: filePath,   // Command실행 경로
                args: ['python3', filename],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                env: {}
              };
              currentTerminal.executeCommand(runPythonCommandLine);
            }
          } else {
            alert('Not Select file!');
          }
        });
      }
    });

    // 사용자가 선택한 Golang 실행 커멘드 메뉴
    commands.registerCommand(RunGolangCommand, {
      execute: async () => {
        this.fileDialogService.showOpenDialog({
          title: RunGolangCommand.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
        }).then((selectUri: URI | undefined) => {
          if (selectUri) {
            const currentTerminal = this.terminalService.currentTerminal;

            if (currentTerminal === undefined) {
              alert('current terminal undefined!');
              return;
            } else {
              const fileFullPath = selectUri.toString();
              const filePathElement = selectUri.toString().split('/');
              const filename = filePathElement[filePathElement.length - 1];
              const filePath = fileFullPath.replace(filename, '').replace('file://', '');

              const runGolangCommandLine: CommandLineOptions = {
                cwd: filePath,   // Command실행 경로
                args: ['go', 'run', filename],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                env: {}
              };
              currentTerminal.executeCommand(runGolangCommandLine);
            }
          } else {
            alert('Not Select file!');
          }
        });
      }
    });

    // Pipeline 관련 Yaml 스켈레톤 코드 생성 메뉴
    commands.registerCommand(GenerateYAMLFileCommand, {
      execute: () => {
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        this.fileService.createFileKetiPythonSkeleton(new URI(rootUri + '/generateYAMLScript.py'));
      }
    });

    // Dockerfile build를 통한 Container 이미지 생성 메뉴
    commands.registerCommand(BuildDockerfileCommand, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please input the Docker Image name:Image tag!'
        });

        this.fileDialogService.showOpenDialog({
          title: BuildDockerfileCommand.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
        }).then((selectUri: URI | undefined) => {
          if (selectUri && result) {
            const currentTerminal = this.terminalService.currentTerminal;

            if (currentTerminal === undefined) {
              alert('current terminal undefined!');
              return;
            } else {
              const fileFullPath = selectUri.toString();
              const filePathElement = selectUri.toString().split('/');
              const filename = filePathElement[filePathElement.length - 1];
              const filePath = fileFullPath.replace(filename, '').replace('file://', '');

              const buildDockerfileToDockerImage: CommandLineOptions = {
                cwd: filePath,   // Command실행 경로
                args: ['docker', 'build', '-t', result, '-f', 'Dockerfile', '.'],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
                env: {}
              };
              currentTerminal.executeCommand(buildDockerfileToDockerImage);

              const printDockerImage: CommandLineOptions = {
                cwd: filePath,
                args: ['docker', 'images'],
                env: {}
              };
              currentTerminal.executeCommand(printDockerImage);
            }
          } else {
            alert('Not Select file!');
          }
        });
      }
    });

    // 사용자가 입력한 Docker run 커멘드를 수행하는 메뉴
    commands.registerCommand(runDockerImgCommand, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please input the Docker Image run command! ex. docker run -it -v "$(pwd):/home/test" -p 80:80 exImg:1.0.0 '
        });

        const currentTerminal = this.terminalService.currentTerminal;

        if (currentTerminal === undefined) {
          alert('current terminal undefined!');
          return;
        } else {
          const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
          const rootUri = firstRootUri.toString().replace('file://', '');

          if (result) {
            const runCommandOption = result.split(' ');
            if (runCommandOption.length >= 1) {
              const runDockerImgToContainer: CommandLineOptions = {
                cwd: rootUri,   // Command실행 경로
                args: runCommandOption,
                env: {}
              };
              currentTerminal.executeCommand(runDockerImgToContainer);
            }
          } else {
            return;
          }
        }
      }
    });

    // 사용자가 생성한 Docker 이미지를 Registry에 Push하는 커멘드 메뉴
    commands.registerCommand(RegistryPushImg, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please input the Docker Image information! ex.gwangyong/keti-theia:1.0.8'
        });
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        const currentTerminal = this.terminalService.currentTerminal;

        if (result && currentTerminal) {
          const RegistryPushImgCommand: CommandLineOptions = {
            cwd: rootUri,   // Command실행 경로
            args: ['docker', 'push', result],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
            env: {}
          };
          currentTerminal.executeCommand(RegistryPushImgCommand);
        }
      }
    });

    // Registry로 부터 사용할 이미지를 Pull하는 커멘드 메뉴
    commands.registerCommand(RegistryPullImg, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please input the Docker Image information! ex.gwangyong/keti-theia:1.0.8'
        });
        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        const currentTerminal = this.terminalService.currentTerminal;

        if (result && currentTerminal) {
          const RegistryPullImgCommand: CommandLineOptions = {
            cwd: rootUri,   // Command실행 경로
            args: ['docker', 'pull', result],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
            env: {}
          };
          currentTerminal.executeCommand(RegistryPullImgCommand);

          const printDockerImage: CommandLineOptions = {
            cwd: rootUri,
            args: ['docker', 'images'],
            env: {}
          };
          currentTerminal.executeCommand(printDockerImage);
        }
      }
    });

    // Registry를 이용하기 접근하기위한 Docker login 메뉴
    // 사용자로부터 ID(Username), PW(Password)를 입력받아 docker login을 수행
    commands.registerCommand(DockerLogin, {
      execute: async () => {
        const dockerId = await this.quickInputService.input({
          placeHolder: 'Please input your docker ID'
        });

        const dockerPw = await this.quickInputService.input({
          placeHolder: 'Please input your docker Password'
        });

        const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
        const rootUri = firstRootUri.toString().replace('file://', '');
        const currentTerminal = this.terminalService.currentTerminal;

        if (dockerId && dockerPw) {
          if (currentTerminal) {
            const RegistryPullImgCommand: CommandLineOptions = {
              cwd: rootUri,   // Command실행 경로
              args: ['docker', 'login', '-u', dockerId, '-p', dockerPw],    // 실행될 커멘트를 Arg단위로 쪼개서 삽입
              env: {}
            };
            currentTerminal.executeCommand(RegistryPullImgCommand);
          }
        }
      }
    });

    // commands.registerCommand(AddNodeandConfigureWorkload, {
    //   execute: () => {
    //     this.fileDialogService.showOpenDialog({
    //       title: AddNodeandConfigureWorkload.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
    //     }).then((selectUri: URI | undefined) => {
    //       if (selectUri) {
    //         const readResult = this.readJsonFile(selectUri);

    //         if (readResult !== undefined) {
    //           readResult.then(json_data => {
    //             // console.log('readResult type: ', typeof (json_data));
    //             // console.log('readResult value: ', json_data);
    //             const firstRootUri = this.workspaceService.tryGetRoots()[0]?.resource;
    //             const rootUri = firstRootUri.toString().replace('file://', '');

    //             this.parseJsonData(json_data.value, new URI(rootUri + '/ML-Pipeline-Yaml.yaml'));
    //           });
    //         } else {
    //           console.log('Can not read file');
    //         }
    //       }
    //     });
    //   }
    // });

    // commands.registerCommand(MLPipelineInfoFunc, {
    //   execute: () => {
    //     this.mlpInfoAPI();
    //   }
    // });

    // commands.registerCommand(MLPipelineRunFunc, {
    //   execute: () => {
    //     this.fileDialogService.showOpenDialog({
    //       title: AddNodeandConfigureWorkload.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
    //     }).then((selectUri: URI | undefined) => {
    //       if (selectUri) {
    //         const readResult = this.readJsonFile(selectUri);

    //         if (readResult !== undefined) {
    //           readResult.then(json_data => {

    //             this.mlpRunAPI(json_data.value);
    //           });
    //         } else {
    //           console.log('Can not read file');
    //         }
    //       }
    //     });
    //   }
    // });

    commands.registerCommand(MLPipelineCreateRunFunc, {
      execute: async () => {
        try {
          // YAML 파일 읽기
          const yamlUri = await this.fileDialogService.showOpenDialog({
            // title: MLPipelineCreateRunFunc.id,
            title: 'Choose a YAML File to Create an ML Pipeline',
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
          });
          // let metadata: { name: string; description: string } | undefined;
          let yamlfile: string | undefined;
          if (yamlUri) {
            const yamlResult = await this.readJsonFile(yamlUri);
            if (yamlResult?.value) {
              yamlfile = yamlResult.value;
              console.log('Read YAML file: ', yamlfile);
            } else {
              console.error('Cannot read YAML file');
              return;
            }
          }

          // Metadata 파일 읽기
          const metadataUri = await this.fileDialogService.showOpenDialog({
            // title: MLPipelineCreateRunFunc.id,
            title: 'Choose a metadata YAML File to Create an ML Pipeline',
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
          });

          let metadata: { name: string; description: string } | undefined;
          if (metadataUri) {
            const metadataResult = await this.readJsonFile(metadataUri);
            if (metadataResult?.value) {
              console.log(metadataResult.value.toString()); // 여기까지 됨
              // const regex = /name:\s*(\d+),\s*value:\s*(\d+)/;
              // const getData = metadataResult.value.match(regex);
              // console.log('metadataResult.value.match(regex): ', metadataResult.value.match(regex));
              // console.log('getData: ', getData);

              // if (getData?.[1] && getData?.[2]) {
              //   metadata = {
              //     name: getData[1],
              //     description: getData[2],
              //   };
              //   console.log('Read metadata: ', metadata);
              // } else {
              //   console.error('Invalid metadata format');
              //   return;
              // }
              const lines = metadataResult.value.split('\n'); // 줄바꿈 기준으로 분리
              const nameLine = lines.find(line => line.trim().startsWith('name:'));
              const descriptionLine = lines.find(line => line.trim().startsWith('description:'));

              if (nameLine && descriptionLine) {
                const nameMatch = nameLine.match(/^name:\s*(.*)$/);
                const descriptionMatch = descriptionLine.match(/^description:\s*(.*)$/);

                if (nameMatch?.[1] && descriptionMatch?.[1]) {
                  metadata = {
                    name: nameMatch[1].trim(),
                    description: descriptionMatch[1].trim(),
                  };
                  console.log('Read metadata: ', metadata);
                } else {
                  console.error('Invalid metadata format: Missing or malformed name/description');
                  return;
                }
              }
            } else {
              console.error('Cannot read metadata file');
              return;
            }
          }

          // YAML과 Metadata가 모두 존재할 경우 API 호출
          if (yamlfile && metadata) {
            console.log('Creating API with:', { yamlfile, metadata });
            this.createRunAPI(yamlfile, metadata.name, metadata.description);
          } else {
            console.error('YAML file or Metadata is undefined');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
      // execute: () => {
      //   let yamlfile: string | undefined;
      //   let metadata: { name: string; description: string } | undefined;
      //   // let metadata: string | undefined;
      //   this.fileDialogService.showOpenDialog({
      //     title: AddNodeandConfigureWorkload.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
      //   }).then((selectUri: URI | undefined) => {
      //     if (selectUri) {
      //       const readResult = this.readJsonFile(selectUri);

      //       if (readResult !== undefined) {
      //         readResult.then(json_data => {

      //           // this.mlpRunAPI(json_data.value);
      //           // YAML 파일 내용 가져오기
      //           yamlfile = json_data.value;
      //         });

      //         console.log('Read yarml file: ' + yamlfile);
      //       } else {
      //         console.log('Can not read file');
      //       }
      //     }
      //   });

      //   // metadata: k1: v1\\ k2: v2
      //   const regex = /name:\s*(\d+),\s*value:\s*(\d+)/;

      //   this.fileDialogService.showOpenDialog({
      //     title: AddNodeandConfigureWorkload.id, canSelectFiles: true, canSelectFolders: false, canSelectMany: false,
      //   }).then((selectUri: URI | undefined) => {
      //     if (selectUri) {
      //       const readResult = this.readJsonFile(selectUri);

      //       if (readResult !== undefined) {
      //         readResult.then(json_data => {

      //           console.log(btoa(json_data
      //             .value.toString())
      //           );
      //           const getData = json_data.value.match(regex);
      //           // eslint-disable-next-line no-null/no-null
      //           if (getData !== null && getData[1] !== undefined && getData[2] !== undefined) {
      //             metadata = {
      //               name: getData[1],
      //               description: getData[2],
      //             };
      //           }
      //           // this.mlpRunAPI(json_data.value);
      //           // metadata=json_data.value.name;

      //         });

      //         console.log('Read metadata file: ', metadata);
      //       } else {
      //         console.log('Can not read file');
      //       }
      //     }
      //   });

      //   // eslint-disable-next-line eqeqeq
      //   if (yamlfile == undefined) {

      //     // eslint-disable-next-line eqeqeq
      //   } else if (metadata == undefined) {

      //   } else {
      //     // input: base64로 인코딩된 yarml, metadata이름, metadata설명
      //     this.createRunAPI(yamlfile, metadata.name, metadata.description);
      //   }

      // }
    });
  }
}

@injectable()
export class SampleMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    const subMenuPath = [...MAIN_MENU_BAR, 'build-menu'];
    menus.registerSubmenu(subMenuPath, 'Build Menu', {
      order: '2' // that should put the menu right next to the File menu
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: MakeCommand.id,
      order: '0'
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: InitProjectDirectory.id,
      order: '1'
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: RunCommand.id,
      order: '2'
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: GenerateYAMLFileCommand.id,
      order: '3'
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: DockerMenuCommand.id,
      order: '4'
    });
    // menus.registerMenuAction(subMenuPath, {
    //   commandId: AddNodeandConfigureWorkload.id,
    //   order: '6'
    // });
    // menus.registerMenuAction(subMenuPath, {
    //   commandId: MLPipelineInfoFunc.id,
    //   order: '7'
    // });
    // menus.registerMenuAction(subMenuPath, {
    //   commandId: MLPipelineRunFunc.id,
    //   order: '8'
    // });

    menus.registerMenuAction(subMenuPath, {
      commandId: MLPipelineCreateRunFunc.id,
      order: '8'
    });

    const subSubMenuPath1 = [...subMenuPath, 'make-sub-menu'];
    const subSubMenuPath5 = [...subMenuPath, 'init-project-directory-menu'];
    const subSubMenuPath6 = [...subMenuPath, 'run-command-menu'];
    const subSubMenuPathDockerCommand = [...subMenuPath, 'docker-command-menu'];
    menus.registerSubmenu(subSubMenuPath1, 'Make Image', { order: '3' });
    menus.registerSubmenu(subSubMenuPath5, 'Init Project Dir', { order: '3' });
    menus.registerSubmenu(subSubMenuPath6, 'Run Command', { order: '4' });
    menus.registerSubmenu(subSubMenuPathDockerCommand, 'Docker Command Menus', { order: '5' });
    menus.registerMenuAction(subSubMenuPath1, {
      commandId: JavaCommand.id,
      order: '1'
    });
    menus.registerMenuAction(subSubMenuPath1, {
      commandId: PythonCommand.id,
      order: '2'
    });
    menus.registerMenuAction(subSubMenuPath1, {
      commandId: GolangCommand.id,
      order: '3'
    });
    menus.registerMenuAction(subSubMenuPath5, {
      commandId: InitGolangProject.id,
      order: '1'
    });
    menus.registerMenuAction(subSubMenuPath6, {
      commandId: RunJavaCommand.id,
      order: '1'
    });
    menus.registerMenuAction(subSubMenuPath6, {
      commandId: RunPython3Command.id,
      order: '2'
    });
    menus.registerMenuAction(subSubMenuPath6, {
      commandId: RunGolangCommand.id,
      order: '3'
    });

    menus.registerMenuAction(subSubMenuPathDockerCommand, {
      commandId: BuildDockerfileCommand.id,
      order: '1'
    });
    menus.registerMenuAction(subSubMenuPathDockerCommand, {
      commandId: runDockerImgCommand.id,
      order: '2'
    });
    menus.registerMenuAction(subSubMenuPathDockerCommand, {
      commandId: RegistryPushImg.id,
      order: '3'
    });
    menus.registerMenuAction(subSubMenuPathDockerCommand, {
      commandId: RegistryPullImg.id,
      order: '4'
    });
    menus.registerMenuAction(subSubMenuPathDockerCommand, {
      commandId: DockerLogin.id,
      order: '5'
    });
    /**
     * Register an action menu with an invalid command (un-registered and without a label) in order
     * to determine that menus and the layout does not break on startup.
     */
    menus.registerMenuAction(subMenuPath, { commandId: 'invalid-command' });
  }

}

/**
 * Special menu node that is not backed by any commands and is always disabled.
 */
export class PlaceholderMenuNode implements MenuNode {

  constructor(readonly id: string, public readonly label: string, protected options?: SubMenuOptions) { }

  get icon(): string | undefined {
    return this.options?.iconClass;
  }

  get sortString(): string {
    return this.options?.order || this.label;
  }

}

export const bindSampleMenu = (bind: interfaces.Bind) => {
  bind(CommandContribution).to(SampleCommandContribution).inSingletonScope();
  bind(MenuContribution).to(SampleMenuContribution).inSingletonScope();
};
