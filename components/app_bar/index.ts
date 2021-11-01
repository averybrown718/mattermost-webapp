// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentChannel} from 'mattermost-redux/selectors/entities/channels';
import {makeAppBindingsSelector} from 'mattermost-redux/selectors/entities/apps';
import {AppBindingLocations} from 'mattermost-redux/constants/apps';

import {getPluggableId} from 'selectors/rhs';

import {GlobalState} from 'types/store';

import AppBar from './app_bar';

const getChannelHeaderBindings = makeAppBindingsSelector(AppBindingLocations.CHANNEL_HEADER_ICON);

const mapStateToProps = (state: GlobalState) => {
    const channelHeaderComponents = state.plugins.components.ChannelHeaderButton;

    const channel = getCurrentChannel(state);

    const pluggableId = getPluggableId(state);
    const components = state.plugins.components.RightHandSidebarComponent;
    const component = components.find((c) => c.id === pluggableId);

    let activePluginId = '';
    if (component) {
        activePluginId = component.pluginId;
    }

    const appBarBindings = getChannelHeaderBindings(state);

    const showAppBar = true;

    return {
        theme: getTheme(state),
        channelHeaderComponents,
        appBarBindings,
        channel,
        activePluginId,
        show: showAppBar,
    };
};

export default connect(mapStateToProps)(AppBar);