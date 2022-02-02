// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type Props = {
    in: boolean;
    children: React.ReactNode | React.ReactNodeArray;
}
export default (props: Props) => (props.in ? <>{props.children}</> : null);