import './Dashboard.scss';
import { DashboardItemInterface } from '../../Models';
import { DashboardItem } from '..';
import * as fdc3 from '@finos/fdc3'

export interface DashboardProps {
  dashboardItems: DashboardItemInterface[];
  selectedDealId?: string;
  onDashboardItemClick: (item: DashboardItemInterface) => any;
  sdkLoaded: Promise<any>;
  ecpOrigin: string;
}

export const Dashboard = (props: DashboardProps) => {
  const onDashboardItemClick = (item: DashboardItemInterface) => {
    props.onDashboardItemClick(item); 

    // FDC3 - 1 : ViewChat intent
    const room = {
      type: 'fdc3.chat.room',
      providerName: 'Symphony',
      id: {
        streamIds: [
          item.details.roomId
        ]
      }
    };
    (fdc3 as any).raiseIntent('ViewChat', room);
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Deal ID</th>
            <th>Last Updated</th>
            <th>Status</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {props.dashboardItems.map((item) => (<DashboardItem ecpOrigin={props.ecpOrigin} sdkLoaded={props.sdkLoaded} isActive={props.selectedDealId === item.dealId} onClick={onDashboardItemClick} key={item.dealId} item={item}></DashboardItem>))}
        </tbody>
      </table>
    </>
    
  );
}
