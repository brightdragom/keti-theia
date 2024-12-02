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

import { createFilterFactory, OVSXRouterFilter } from '../ovsx-router-client';
import { VSXQueryOptions, VSXSearchOptions } from '../ovsx-types';
import { AbstractRegExpFilter } from './abstract-reg-exp-filter';

export const RequestContainsFilterFactory = createFilterFactory('ifRequestContains', ifRequestContains => {
    if (typeof ifRequestContains !== 'string') {
        throw new TypeError(`expected a string, got: ${typeof ifRequestContains}`);
    }
    return new RequestContainsFilter(new RegExp(ifRequestContains, 'i'));
});

export class RequestContainsFilter extends AbstractRegExpFilter implements OVSXRouterFilter {
    filterSearchOptions(searchOptions?: VSXSearchOptions): boolean {
        return !searchOptions || this.test(searchOptions.query) || this.test(searchOptions.category);
    }
    filterQueryOptions(queryOptions?: VSXQueryOptions): boolean {
        return !queryOptions || Object.values(queryOptions).some(this.test, this);
    }
}
