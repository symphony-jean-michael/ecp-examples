import React, { RefObject } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button } from '@symphony-ui/uitoolkit-components';
import * as fdc3 from '@finos/fdc3'
import { DashboardItemInterface } from "../../Models"
import { Graph, Loading } from '..';
import './DashboardItemDetails.scss';

export interface DashboardItemDetailsState {
  sdkLoading: boolean;
}
export interface DashboardItemDetailsProps {
  deal: DashboardItemInterface;
  sdkLoaded: Promise<any>;
  ecpOrigin: string;
  onClose: () => any;
}

export class DashboardItemDetails extends React.PureComponent<DashboardItemDetailsProps, DashboardItemDetailsState> {

  private chatId: string;
  private chatRef: RefObject<HTMLDivElement>;

  constructor(props: DashboardItemDetailsProps) {
    super(props);
    this.chatId = `symphony-ecm-${props.deal.dealId}-${Date.now()}`;
    this.chatRef = React.createRef();
    this.state = {sdkLoading: true};
  }

  private openStream = () => {
    const roomId = this.props.deal.details.roomId && this.props.deal.details.roomId/*[this.props.ecpOrigin]*/;
    if (roomId) {
      return (window as any).symphony.openStream(roomId, `#${this.chatId}`)
    }
  }

  componentDidMount() {
    this.props.sdkLoaded.then(() => {
      this.openStream().then(() => {
        this.setState({sdkLoading: false});
        console.log('FULLY LOADED');
      });
    });
  }

  componentDidUpdate(previousProps: DashboardItemDetailsProps) {
    if (previousProps.deal.dealId !== this.props.deal.dealId) {
      this.props.sdkLoaded.then(() => {
        this.openStream();
      });
    }
  }

  onShare = (b64Image: string) => {
    const roomId = this.props.deal.details.roomId && this.props.deal.details.roomId/*[this.props.ecpOrigin]*/;
    if (!roomId) {
      return;
    }
    const message = {
      text: {
        ['text/markdown']: '',
      },
      entities: {
        attachmentImage: {
          type: 'fdc3.fileAttachment',
          data: {
            name: 'graph.jpeg',
            dataUri: b64Image,
          },
        },
      }
    };
    return (window as any).symphony.sendMessage(message, {
      mode: 'blast',
      streamIds: [roomId],
      users: [],
      container: this.chatId
    })
  };

  render() {
    const { name, details } = this.props.deal;
    return (
      <div className="dashboard-item-details">
        <div className="dashboard-item-details-header">
          <h2 className="title">{name}</h2>
          <div className="close cross" onClick={() => this.props.onClose()}>x</div>
        </div>
        <div className="graph">
          <Graph dealId={this.props.deal.dealId} dealName={this.props.deal.name} onShare={this.onShare}></Graph>
        </div>
        <div className="tabs">
              <div className="deal-details">
                <div className='deal-members'>
                  <div className="deal-detail-block-title">
                    Members
                  </div>
                  <ul>
                    {this.props.deal.details.members?.map((member) => (<li key={`list-item-${member.name}`}>{member.name}</li>))}
                  </ul>
                </div>
                <div className="deal-detail-block">
                  <span className="deal-detail-block-title">Country</span>
                  <span className="deal-detail-block-content">{details.country}</span>
                </div>
                <div className="deal-detail-block">
                  <span className="deal-detail-block-title">Risk level</span>
                  <span className="deal-detail-block-content">{details.riskLevel}</span>
                </div>
                <div className="deal-detail-block">
                  <span className="deal-detail-block-title">Type</span>
                  <span className="deal-detail-block-content">{details.type}</span>
                </div>
                <div className="deal-detail-block">
                  <span className="deal-detail-block-title">Minimum</span>
                  <span className="deal-detail-block-content">{details.minimum}</span>
                </div>

                <div className="deal-detail-block">
                  <span>
                    <Button onClick={() => {
                      /* FDC3 - Add a new button to send a message to details.roomId */

                      const room = {
                        type: 'fdc3.chat.room',
                        providerName: 'Symphony',
                        id: {
                          streamIds: [
                            details.roomId
                          ]
                        }
                      };

                      const message = {
                        type: 'fdc3.chat.message',
                        chatRoom: room,
                        message: {
                          type: 'fdc3.message',
                          text: {
                            'text/markdown': 'Hey guys ! What do you think about **the new value** ? \n\n §[Open Chart](id/button1)'
                          },
                          entities: {
                            button1: {
                              type: 'fdc3.fdc3Intent',
                              data: {
                                title: 'View chart',
                                intent: 'ViewChart',
                                context: {
                                  type: 'fdc3.chart',
                                  instruments: [
                                    {
                                      type: 'fdc3.instrument',
                                      id: {
                                        ticker: 'AAPL'
                                      }
                                    }
                                  ],
                                  style: 'mountain'
                                }
                              }
                            }
                          }
                        }
                      };

                      fdc3.raiseIntent('SendChatMessage', message);

                    }}>Send Chat Message</Button>
                  </span>
                </div>

              </div>
        </div>
      </div>
    )
  }
}
