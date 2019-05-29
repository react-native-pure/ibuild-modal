/**
 * @overview 文件描述
 * @author heykk
 */

'use strict';

import React from 'react'
import {render} from 'react-native-testing-library'
import {PopModal} from '../index'

describe('TreeModal', () => {
    it('renders correctly', () => {
        const instance = render(
            <PopModal/>
        );
        expect(instance.toJSON()).toMatchSnapshot();
    });
});
