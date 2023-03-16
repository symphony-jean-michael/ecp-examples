import React, { RefObject } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button } from '@symphony-ui/uitoolkit-components';

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
    const roomId = this.props.deal.details.roomId && this.props.deal.details.roomId[this.props.ecpOrigin];
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
    const roomId = this.props.deal.details.roomId && this.props.deal.details.roomId[this.props.ecpOrigin];
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
                  <span className="deal-detail-block-content" style={{display: 'none'}}>
                    <Button onClick={() => {
                      console.log(`FDC3: OpenRoom`, details);

                      const contacts = details.members.map((member) => ({ type: 'fdc3.contact', id: { email: member.email } }));
                      const contextList = {
                        type: 'fdc3.contactList',
                        contacts
                      };
                      console.log(contextList);
                      const context = {
                        type: 'fdc3.chat.room',
                        providerName: 'Symphony',
                        id: {
                          streamIds: [details.roomId['st3.symphony.com']]
                        }
                      };

                      (window as any).fdc3.raiseIntent('ViewChat', context);

                    }}>Open Room</Button>
                  </span>
                  <span>
                    <Button onClick={() => {
                      console.log(`FDC3: SendChatMessage`, details);

                      const chatRoom = {
                        "type": "fdc3.chat.room",
                        "providerName": "Symphony",
                        "id": {
                          "streamIds": [
                            details.roomId['st3.symphony.com']
                          ]
                        }
                      };
                      let chatMessageOld = {
                        "type": "fdc3.chat.message",
                        chatRoom,
                        "message": {
                          "type": "fdc3.message",
                          "text": {
                            "text/markdown": "Hey guys ! What do you think about **the new value** ? \n\n §[Open Chart](id/button1)"
                          },
                          "entities": {
                            "button1": {
                              "type": "fdc3.fdc3Intent",
                              "data": {
                                "title": "View chart",
                                "intent": "ViewChart",
                                "context": {
                                  "type": "fdc3.instrument",
                                  "name": "Biot",
                                  "id": {
                                    "ticker": "MSFT",
                                  }
                                }
                              }
                            }
                          }                       
                        }
                      };

                      let chatMessage2 = {
                        "type": "fdc3.chat.message",
                        chatRoom,
                        "message": {
                          "type": "fdc3.message",
                          "text": {
                            "text/markdown": "Hey guys ! What do you think about **the new value** ? \n\n §[Open Chart](id/button1)"
                          },
                          "entities": {
                            "button1": {
                              "type": "fdc3.fdc3Intent",
                              "data": {
                                "title": "View chart",
                                "intent": "ViewChart",
                                "context": {
                                  type: "fdc3.chart",
                                  instruments: [
                                      {
                                          type: "fdc3.instrument",
                                          id: {
                                              ticker: "AAPL"
                                          }
                                      },
                                      {
                                          type: "fdc3.instrument",
                                          id: {
                                              ticker: "GOOG"
                                          }
                                      }
                                  ],
                                  range: {
                                      type: "fdc3.timeRange",
                                      starttime: "2020-09-01T08:00:00.000Z",
                                      endtime: "2020-10-31T08:00:00.000Z"
                                  },
                                  style: "line",
                                  otherConfig: {
                                    indicators: [
                                        {
                                            name: "ma",
                                            parameters: {
                                                period: 14,
                                                type: "ema"
                                            }
                                        },
                                        {
                                            name: "volume"
                                        }
                                    ]
                                  }
                                }
                              }
                            }
                          }                       
                        }
                      };


                      let chatMessage = {
                        type: "fdc3.chat.message",
                        chatRoom,
                        message: {
                          type: "fdc3.message",
                          text: {
                            "text/markdown": "Hey guys ! What do you think about **the new value** ? \n\n §[Open Chart](id/button1)"
                          },
                          entities: {
                            button1: {
                              type: "fdc3.fdc3Intent",
                              data: {
                                title: "View chart",
                                intent: "ViewChart",
                                context: {
                                  type: "fdc3.chart",
                                  instruments: [
                                    {
                                      type: "fdc3.instrument",
                                      id: {
                                        ticker: "AAPL"
                                      }
                                    }
                                  ],
                                  range: {
                                      type: "fdc3.timeRange",
                                      starttime: "2020-09-01T08:00:00.000Z",
                                      endtime: "2020-10-31T08:00:00.000Z"
                                  },
                                  style: "mountain",
                                  otherConfig: {
                                    indicators: [
                                      {
                                        name: "volume"
                                      }
                                    ]
                                  }
                                }
                              }
                            }
                          }                       
                        }
                      };

                    (window as any).fdc3.raiseIntent("SendChatMessage", chatMessage);
                    }}>Send Chat Message</Button>
                  </span>
                </div>

              </div>
        </div>
      </div>
    )
  }
}
