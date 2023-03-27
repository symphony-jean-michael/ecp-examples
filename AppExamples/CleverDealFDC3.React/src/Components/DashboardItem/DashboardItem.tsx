import { useEffect, useState } from 'react';
import {DashboardItemInterface} from '../../Models';
import './DashboardItem.scss';

export interface DashboardItemProps {
  item: DashboardItemInterface;
  isActive: boolean;
  onClick: (item: DashboardItemInterface) => any;
  sdkLoaded: Promise<any>;
  ecpOrigin: string;
}

export const DashboardItem = (props: DashboardItemProps) => {
  const {dealId, lastUpdated, status, name} = props.item;
  const [badgeCount, setBadgeCount] = useState<number>(0);
  return (
    <tr className={`item-row ${props.isActive ? 'active' : ''} ${props.item.status === 'active' ? 'clickable' : ''}`} onClick={() => props.item.status === 'active' && props.onClick(props.item)}>
      <td className="item-cell">{dealId}</td>
      <td className="item-cell">{lastUpdated}</td>
      <td className="item-cell status"><div className="status-badge-cell"><div className={`status-badge ${status}`}>{status}</div></div></td>
      <td className="item-cell">
        {name}
        { badgeCount ? 
        (<div className='badge-count-container'><div className="badge-count">{badgeCount}</div></div>) : null
        }  
      </td>

    </tr>
  )
};
