// *****************************************************************************
// Copyright (C) 2023 Ericsson and others.
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// code copied and modified from https://github.com/microsoft/vscode/blob/1.77.0/src/vscode-dts/vscode.proposed.scmValidation.d.ts

export module '@theia/plugin' {

    /**
     * Represents the validation type of the Source Control input.
     */
    export enum SourceControlInputBoxValidationType {

        /**
         * Something not allowed by the rules of a language or other means.
         */
        Error = 0,

        /**
         * Something suspicious but allowed.
         */
        Warning = 1,

        /**
         * Something to inform about but not a problem.
         */
        Information = 2
    }

    export interface SourceControlInputBoxValidation {

        /**
         * The validation message to display.
         */
        readonly message: string;

        /**
         * The validation type.
         */
        readonly type: SourceControlInputBoxValidationType;
    }

    /**
     * Represents the input box in the Source Control viewlet.
     */
    export interface SourceControlInputBox {

        /**
         * A validation function for the input box. It's possible to change
         * the validation provider simply by setting this property to a different function.
         */
        validateInput?(value: string, cursorPosition: number): ProviderResult<SourceControlInputBoxValidation | undefined | null>;
    }
}
