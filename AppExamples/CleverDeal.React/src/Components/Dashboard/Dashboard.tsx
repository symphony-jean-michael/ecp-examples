import './Dashboard.scss';
import { DashboardItemInterface } from '../../Models';
import { DashboardItem } from '..';
import '../demo';


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

    // TODO: FDC3 - 1 : Open the Symphony room (ViewChat intent)
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
          {props.dashboardItems.map((item) => (<DashboardItem onClick={onDashboardItemClick}  ecpOrigin={props.ecpOrigin} sdkLoaded={props.sdkLoaded} isActive={props.selectedDealId === item.dealId} key={item.dealId} item={item}></DashboardItem>))}
        </tbody>
      </table>
    </>
    
  );
}
