// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {useIntl} from 'react-intl';

import {useSelector} from 'react-redux';

import {GlobalState} from 'mattermost-redux/types/store';

import UpdatesAndErrorsSvg from 'components/common/svg_images_components/updates_and_errors_svg';
import ConfigurationSvg from 'components/common/svg_images_components/configuration_svg';
import WorkspaceAccessSvg from 'components/common/svg_images_components/workspace_access_svg';
import PerformanceSvg from 'components/common/svg_images_components/performance_svg';
import SecuritySvg from 'components/common/svg_images_components/security_svg';
import DataPrivacySvg from 'components/common/svg_images_components/data_privacy_svg';
import EasyManagementSvg from 'components/common/svg_images_components/easy_management_svg';

import {ConsolePages} from 'utils/constants';

type DataModel = {
    [key: string]: {
        title: string;
        description: string;
        items: ItemModel[];
        icon: React.ReactNode;
    };
}

type ItemStatus = 'none' | 'ok' | 'info' | 'warning' | 'error';

type ItemModel = {
    id: string;
    title: string;
    description: string;
    status: ItemStatus;
    scoreImpact: number;
    impactModifier: number;
    configUrl?: string;
    configText?: string;
    telemetryAction?: string;
    infoUrl?: string;
}

type UpdatesParam = {
    serverVersion: {
        version: string;
        type: string;
        status: ItemStatus;
    };
}

const impactModifiers: Record<ItemStatus, number> = {
    none: 1,
    ok: 1,
    info: 0.9,
    warning: 0.5,
    error: 0,
};

const useMetricsData = () => {
    const {formatMessage} = useIntl();
    const prevTrialLicense = useSelector((state: GlobalState) => state.entities.admin.prevTrialLicense);

    const trialOrEnterpriseCtaConfig = {
        configUrl: ConsolePages.LICENSE,
        configText: prevTrialLicense ? formatMessage({id: 'admin.reporting.workspace_optimization.cta.upgradeLicense', defaultMessage: 'Upgrade to Enterprise'}) : formatMessage({id: 'admin.reporting.workspace_optimization.cta.startTrial', defaultMessage: 'Start Trial'}),
        telemetryAction: 'set_here_the_telemetry_action',
    };

    const getUpdatesData = (data: UpdatesParam) => ({
        title: formatMessage({id: 'admin.reporting.workspace_optimization.updates.title', defaultMessage: 'Updates and Errors'}),
        description: formatMessage({id: 'admin.reporting.workspace_optimization.updates.description', defaultMessage: 'You have an update to consider'}),
        icon: (
            <div className='icon'>
                <UpdatesAndErrorsSvg
                    width={22}
                    height={22}
                />
            </div>
        ),
        items: [
            {
                id: 'server_version',
                title: data.serverVersion.status === 'ok' ? formatMessage({
                    id: 'admin.reporting.workspace_optimization.updates.server_version.status.ok.title',
                    defaultMessage: 'Your Mattermost server is running the latest version',
                }) : formatMessage({
                    id: 'admin.reporting.workspace_optimization.updates.server_version.status.error.title',
                    defaultMessage: '{type} version update available',
                }, {type: data.serverVersion.type}),
                description: data.serverVersion.status === 'ok' ? formatMessage({
                    id: 'admin.reporting.workspace_optimization.updates.server_version.status.ok.description',
                    defaultMessage: 'Placeholder: Nothing to do here. All good!',
                }) : formatMessage({
                    id: 'admin.reporting.workspace_optimization.updates.server_version.status.error.description',
                    defaultMessage: 'Placeholder: Mattermost {version} contains a medium level security fix. Upgrading to this release is recommended.',
                }, {version: data.serverVersion.version}),
                configUrl: 'https://docs.mattermost.com/upgrade/upgrading-mattermost-server.html',
                configText: formatMessage({id: 'admin.reporting.workspace_optimization.downloadUpdate', defaultMessage: 'Download Update'}),
                telemetryAction: 'set_here_the_telemetry_action',
                status: data.serverVersion.status,
                scoreImpact: 15,
                impactModifier: impactModifiers[data.serverVersion.status],
            },
        ],
    });

    type ConfigurationParam = {
        ssl: {
            status: ItemStatus;
        };
        sessionLength: {
            status: ItemStatus;
        };
    }

    const getConfigurationData = (data: ConfigurationParam) => ({
        title: formatMessage({id: 'admin.reporting.workspace_optimization.configuration.title', defaultMessage: 'Configuration'}),
        description: formatMessage({id: 'admin.reporting.workspace_optimization.configuration.description', defaultMessage: 'You have configuration problems to resolve'}),
        icon: (
            <div className='icon'>
                <ConfigurationSvg
                    width={20}
                    height={20}
                />
            </div>
        ),
        items: [
            {
                id: 'ssl',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.configuration.ssl.title',
                    defaultMessage: 'Configure SSL to make your server more secure',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.configuration.ssl.description',
                    defaultMessage: 'Make your server more secure by configuring SSL.',
                }),
                telemetryAction: 'set_here_the_telemetry_action',
                infoUrl: 'https://docs.mattermost.com/onboard/ssl-client-certificate.html',
                infoText: formatMessage({id: 'admin.reporting.workspace_optimization.cta.learnMore', defaultMessage: 'Learn more'}),
                status: data.ssl.status,
                scoreImpact: 25,
                impactModifier: impactModifiers[data.ssl.status],
            },
            {
                id: 'session-length',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.session_length.title',
                    defaultMessage: 'Session length is still set to defaults',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.session_length.description',
                    defaultMessage: 'Your session length is still set to the default of 30 days (or higher). Most servers adjust this according to their organizations needs. To provide more convenience to your users consider increasing the lengths, however if tighter security is more top of mind then pick a length that better aligns with your organizations policies.',
                }),
                configUrl: ConsolePages.SESSION_LENGTHS,
                configText: formatMessage({id: 'admin.reporting.workspace_optimization.cta.configureSessionLength', defaultMessage: 'Configure Session Length'}),
                telemetryAction: 'set_here_the_telemetry_action',
                status: data.sessionLength.status,
                scoreImpact: 8,
                impactModifier: impactModifiers[data.sessionLength.status],
            },
        ],
    });

    type AccessParam = {
        siteUrl: {
            status: ItemStatus;
        };
    }

    const getAccessData = (data: AccessParam) => ({
        title: formatMessage({
            id: 'admin.reporting.workspace_optimization.access.title',
            defaultMessage: 'Workspace Access',
        }),
        description: formatMessage({
            id: 'admin.reporting.workspace_optimization.access.description',
            defaultMessage: 'Web server settings could be affecting access.',
        }),
        icon: (
            <div className='icon'>
                <WorkspaceAccessSvg
                    width={20}
                    height={20}
                />
            </div>
        ),
        items: [
            {
                id: 'site-url',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.access.site_url.title',
                    defaultMessage: 'Misconfigured Web Server',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.access.site_url.description',
                    defaultMessage: 'Your webserver settings are not passing a live URL test, this would prevent users from accessing this workspace, we recommend updating your settings.',
                }),
                configUrl: '/site-url',
                telemetryAction: 'set_here_the_telemetry_action',
                configText: formatMessage({id: 'admin.reporting.workspace_optimization.cta.configureWebServer', defaultMessage: 'Configure Web Server'}),
                infoUrl: '#',
                status: data.siteUrl.status,
                scoreImpact: 12,
                impactModifier: impactModifiers[data.siteUrl.status],
            },
        ],
    });

    type PerformanceParam = {
        search: {
            status: ItemStatus;
        };
    }

    const getPerformanceData = (data: PerformanceParam) => ({
        title: formatMessage({
            id: 'admin.reporting.workspace_optimization.performance.title',
            defaultMessage: 'Performance',
        }),
        description: formatMessage({
            id: 'admin.reporting.workspace_optimization.performance.description',
            defaultMessage: 'Your server could use some performance tweaks.',
        }),
        icon: (
            <div className='icon'>
                <PerformanceSvg
                    width={20}
                    height={20}
                />
            </div>
        ),
        items: [
            {
                id: 'search',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.performance.search.title',
                    defaultMessage: 'Search performance',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.performance.search.description',
                    defaultMessage: 'Your server has reached over 500 users and 2 million posts which can result in slow search performance. We recommend starting an Enterprise trial and enabling Elasticsearch for better performance.',
                }),
                ...trialOrEnterpriseCtaConfig,
                infoUrl: 'https://docs.mattermost.com/scale/elasticsearch.html',
                infoText: formatMessage({id: 'admin.reporting.workspace_optimization.cta.learnMore', defaultMessage: 'Learn more'}),
                status: data.search.status,
                scoreImpact: 20,
                impactModifier: impactModifiers[data.search.status],
            },
        ],
    });

    type SecurityParam = {
        loginAttempts: {
            count: number;
            status: ItemStatus;
        };
    }

    // TBD
    const getSecurityData = (data: SecurityParam) => ({
        title: formatMessage({
            id: 'admin.reporting.workspace_optimization.security.title',
            defaultMessage: 'Security Concerns',
        }),
        description: formatMessage({
            id: 'admin.reporting.workspace_optimization.security.description',
            defaultMessage: 'There are security concerns you should look at.',
        }),
        icon: (
            <div className='icon'>
                <SecuritySvg
                    width={20}
                    height={20}
                />
            </div>
        ),
        items: [
            {
                id: 'login-attempts',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.security.login_attempts.title',
                    defaultMessage: 'Failed login attempts detected',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.security.login_attempts.description',
                    defaultMessage: '{attempts} failed login attempts have been detected on this workspace. We recommend reviewing your security logs to understand this security risk.',
                }, {attempts: data.loginAttempts.count}),
                configUrl: '/admin_console/reporting/server_logs',
                telemetryAction: 'set_here_the_telemetry_action',
                configText: formatMessage({id: 'admin.reporting.workspace_optimization.cta.viewServerLogs', defaultMessage: 'View Server Logs'}),
                status: data.loginAttempts.status,
                scoreImpact: 10,
                impactModifier: impactModifiers[data.loginAttempts.status],
            },
        ],
    });

    type DataPrivacyParam = {
        retention: {
            status: ItemStatus;
        };
    }

    // TBD
    const getDataPrivacyData = (data: DataPrivacyParam) => ({
        title: formatMessage({
            id: 'admin.reporting.workspace_optimization.data_privacy.title',
            defaultMessage: 'Data Privacy',
        }),
        description: formatMessage({
            id: 'admin.reporting.workspace_optimization.data_privacy.description',
            defaultMessage: 'Get better insight and control over your data.',
        }),
        icon: (
            <div className='icon'>
                <DataPrivacySvg
                    width={20}
                    height={20}
                />
            </div>
        ),
        items: [
            {
                id: 'privacy',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.data_privacy.retention.title',
                    defaultMessage: 'Become more data aware',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.data_privacy.retention.description',
                    defaultMessage: 'Organizations in highly regulated industries require more control and insight with their data. We recommend starting an Enterprise trial to take advantage of Mattermost Data Retention and Compliance features.',
                }),
                ...trialOrEnterpriseCtaConfig,
                infoUrl: 'https://docs.mattermost.com/comply/data-retention-policy.html',
                infoText: formatMessage({id: 'admin.reporting.workspace_optimization.cta.learnMore', defaultMessage: 'Learn more'}),
                status: data.retention.status,
                scoreImpact: 16,
                impactModifier: impactModifiers[data.retention.status],
            },
        ],
    });

    type EaseOfManagementParam = {
        ldap: {
            status: ItemStatus;
        };
        guestAccounts: {
            status: ItemStatus;
        };
    }

    // TBD
    const getEaseOfManagementData = (data: EaseOfManagementParam) => ({
        title: formatMessage({
            id: 'admin.reporting.workspace_optimization.ease_of_management.title',
            defaultMessage: 'Ease of management',
        }),
        description: formatMessage({
            id: 'admin.reporting.workspace_optimization.ease_of_management.description',
            defaultMessage: 'We have suggestions that could make your managemenet easier.',
        }),
        icon: (
            <div className='icon'>
                <EasyManagementSvg
                    width={20}
                    height={20}
                />
            </div>
        ),
        items: [
            {
                id: 'ldap',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.ease_of_management.ldap.title',
                    defaultMessage: 'AD/LDAP integration recommended',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.ease_of_management.ldap.description',
                    defaultMessage: 'You\'ve reached over 100 users! We recommend starting an Enterprise trial and setting up AD/LDAP user authentication for easier onboarding as well as automated deactivations and role assignments.',
                }),
                ...trialOrEnterpriseCtaConfig,
                infoUrl: 'https://docs.mattermost.com/configure/configuration-settings.html#ad-ldap',
                status: data.ldap.status,
                scoreImpact: 22,
                impactModifier: impactModifiers[data.ldap.status],
            },
            {
                id: 'guests_accounts',
                title: formatMessage({
                    id: 'admin.reporting.workspace_optimization.ease_of_management.guests_accounts.title',
                    defaultMessage: 'Guest Accounts recommended',
                }),
                description: formatMessage({
                    id: 'admin.reporting.workspace_optimization.ease_of_management.guests_accounts.description',
                    defaultMessage: 'Several user accounts are using different domains than your Site URL. You can control user access to channels and teams with guest accounts. We recommend starting an Enterprise trial and enabling Guest Access.',
                }),
                ...trialOrEnterpriseCtaConfig,
                infoUrl: 'https://docs.mattermost.com/onboard/guest-accounts.html',
                infoText: formatMessage({id: 'admin.reporting.workspace_optimization.cta.learnMore', defaultMessage: 'Learn more'}),
                status: data.guestAccounts.status,
                scoreImpact: 6,
                impactModifier: impactModifiers[data.guestAccounts.status],
            },
        ],
    });

    return {getAccessData, getConfigurationData, getUpdatesData, getPerformanceData, getSecurityData, getDataPrivacyData, getEaseOfManagementData};
};

export {DataModel, ItemModel, ItemStatus};
export default useMetricsData;