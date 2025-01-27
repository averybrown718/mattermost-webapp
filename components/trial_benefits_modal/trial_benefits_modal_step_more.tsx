// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';

import {trackEvent} from 'actions/telemetry_actions';

import {TELEMETRY_CATEGORIES} from 'utils/constants';

import './trial_benefits_modal_step_more.scss';

export type TrialBenefitsModalStepMoreProps = {
    route: string;
    message: string;
    onClick?: () => void;
}

const TrialBenefitsModalStepMore = (
    {
        route,
        message,
        onClick,
    }: TrialBenefitsModalStepMoreProps) => {
    const history = useHistory();

    const redirect = useCallback(() => {
        history.push(route);
        onClick!();

        const lastSection = route.split('/').pop();
        trackEvent(
            TELEMETRY_CATEGORIES.SELF_HOSTED_START_TRIAL_MODAL,
            'benefits_modal_section_opened_' + lastSection,
        );
    }, [route, onClick]);

    return (
        <a
            className='TrialBenefitsModalStepMore learn-more-button'
            onClick={redirect}
        >
            {message}
        </a>
    );
};

export default TrialBenefitsModalStepMore;
