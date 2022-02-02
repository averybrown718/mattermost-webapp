// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import Constants from 'utils/constants';

import MultiSelectCard, {Props as CardProps} from './multi_select_card';
import './index.scss';

type Props = {
    next?: () => void;
    cards: CardProps[];
}

export default function MultiSelectCards(props: Props) {
    const onNext = (e: React.KeyboardEvent) => {
        if (e.key !== Constants.KeyCodes.ENTER[0]) {
            return;
        }
        if (!props.next) {
            return;
        }

        props.next();
    };

    return (
        <ul
            onKeyUp={onNext}
            className='MultiSelectCards'
        >
            {props.cards.map((card) => (
                <MultiSelectCard
                    key={card.id}
                    {...card}
                />
            ))}
        </ul>
    );
}