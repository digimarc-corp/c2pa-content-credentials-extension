import { SubprocessCommunicationManagerBase } from '../../utilities/subprocess/SubprocessCommunicationManagerBase';
import { ISubprocessMessageBase } from '../../utilities/subprocess/SubprocessCommunication';
export declare class EmitCompletedCallbackManager extends SubprocessCommunicationManagerBase {
    private readonly _callback;
    constructor(callback: () => void);
    callback(): void;
    canHandleMessageFromSubprocess(message: ISubprocessMessageBase): boolean;
    receiveMessageFromSubprocess(message: ISubprocessMessageBase): void;
    canHandleMessageFromParentProcess(message: ISubprocessMessageBase): boolean;
    receiveMessageFromParentProcess(message: ISubprocessMessageBase): void;
}
//# sourceMappingURL=EmitCompletedCallbackManager.d.ts.map