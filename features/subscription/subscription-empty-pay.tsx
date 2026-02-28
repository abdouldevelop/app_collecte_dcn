import React from 'react';
import { AppEmptyState } from '@/components/ui';

type Props = {
  icon?: any;
  title?: string;
};

const SubscriptionEmptyPay = ({
  icon = 'inbox',
  title = 'Aucun paiement',
}: Props) => {
  // Map the icon prop: if it's an emoji string or unrecognized, use Feather fallback
  const featherIcon =
    typeof icon === 'string' && !icon.match(/[\u{1F000}-\u{1FFFF}]/u)
      ? (icon as React.ComponentProps<typeof import('@expo/vector-icons').Feather>['name'])
      : 'inbox';

  return (
    <AppEmptyState
      icon={featherIcon}
      title={title}
      description=""
    />
  );
};

export default SubscriptionEmptyPay;
