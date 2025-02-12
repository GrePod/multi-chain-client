import { ServerStateResponse } from "xrpl";
import { ServerState } from "xrpl/dist/npm/models/methods/serverInfo";
import { Managed } from "../../utils/managed";
import { NodeStatusBase } from "../StatusBase";

@Managed()
export class XrpNodeStatus extends NodeStatusBase<ServerStateResponse> {
   public get version(): string {
      return this.data.result.state.build_version;
   }

   /**
    * @docs https://xrpl.org/rippled-server-states.html
    */

   public get state(): ServerState {
      return this.data.result.state.server_state;
   }

   public get isHealthy(): boolean {
      return ["connected", "syncing", "tracking", "full", "validating", "proposing"].includes(this.state);
   }

   public get isSynced(): boolean {
      return ["full", "validating", "proposing"].includes(this.state);
   }
}
