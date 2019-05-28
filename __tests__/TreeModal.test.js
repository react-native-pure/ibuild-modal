/**
 * @overview 文件描述
 * @author heykk
 */

'use strict';

import React from 'react'
import {render} from 'react-native-testing-library'
import {TreeSelector} from '../index'

describe('TreeModal', () => {
    it('renders correctly', () => {
        const instance = render(
            <TreeSelector/>
        );
        expect(instance.toJSON()).toMatchSnapshot();
    });
});
