
export interface PFCMessage {
    id?: string,
    method?: string,
    args?: unknown[],
    result?: string|object|string[]|null
}

export interface PFCMessageEvent extends Event{
    detail: PFCMessage
}
