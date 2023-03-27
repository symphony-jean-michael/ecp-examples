//import * as fdc3 from '@finos/fdc3'

export declare type IntentResult = Context;

interface IntentResolution {
    readonly source: AppIdentifier;
    readonly intent: string;
    readonly version?: string;
    getResult(): Promise<IntentResult>;
}

interface AppIdentifier {
  /** The unique application identifier located within a specific application directory instance. An example of an appId might be 'app@sub.root' */
  readonly appId: string;
  /** An optional instance identifier, indicating that this object represents a specific instance of the application described.*/
  readonly instanceId?: string;
}

interface Context {
  id?: {
      [key: string]: string | string[];  // Fix until the Finos PR is merged
  };
  name?: string;
  type: string;
}

declare global {
  interface Window {
    fdc3: {
      raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution>;
    }
  }
}


export {};