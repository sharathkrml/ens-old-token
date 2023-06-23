import { BigInt } from "@graphprotocol/graph-ts"
import {
    ControllerAdded,
    ControllerRemoved,
    NameMigrated as NameMigratedEvent,
    NameRegistered as NameRegisteredEvent,
    NameRenewed as NameRenewedEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Transfer as TransferEvent,
} from "../generated/BaseRegistrarImplementation/BaseRegistrarImplementation"
import {
    Controller,
    NameMigrated,
    NameRegistered,
    NameRenewed,
    OwnershipTransferred,
    Counter,
    Transfer,
} from "../generated/schema"

export function handleControllerAdded(event: ControllerAdded): void {
    const controller = event.params.controller
    let entity = Controller.load(controller.toHexString())
    if (!entity) {
        entity = new Controller(controller.toHexString())
        entity.controller = controller
        entity.createdAt = event.transaction.hash
    } else {
        throw new Error("Controller already added, " + controller.toHexString())
    }
    entity.save()
}

export function handleControllerRemoved(event: ControllerRemoved): void {
    const controller = event.params.controller
    let entity = Controller.load(controller.toHexString())
    if (!entity) {
        throw new Error("Controller should be already added, " + controller.toHexString())
    } else {
        entity.removedAt = event.transaction.hash
    }
    entity.save()
}

export function handleNameMigrated(event: NameMigratedEvent): void {
    let counter = getCounter("NameMigrated")

    let nameMigrated = new NameMigrated(counter.count.toString())
    nameMigrated.index = counter.count
    nameMigrated.hash = event.transaction.hash
    nameMigrated.ensId = event.params.id
    nameMigrated.owner = event.params.owner
    nameMigrated.expires = event.params.expires
    nameMigrated.save()

    counter.save()
}

export function handleNameRegistered(event: NameRegisteredEvent): void {
    let counter = getCounter("NameRegistered")

    let nameRegistered = new NameRegistered(counter.count.toString())
    nameRegistered.index = counter.count
    nameRegistered.hash = event.transaction.hash
    nameRegistered.ensId = event.params.id
    nameRegistered.owner = event.params.owner
    nameRegistered.expires = event.params.expires
    nameRegistered.save()

    counter.save()
}

export function handleNameRenewed(event: NameRenewedEvent): void {
    let counter = getCounter("NameRegistered")

    let nameRenewed = new NameRenewed(counter.count.toString())
    nameRenewed.index = counter.count
    nameRenewed.hash = event.transaction.hash
    nameRenewed.ensId = event.params.id
    nameRenewed.expires = event.params.expires
    nameRenewed.save()

    counter.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
    let counter = getCounter("OwnershipTransferred")

    let ownershipTransferred = new OwnershipTransferred(counter.count.toString())
    ownershipTransferred.index = counter.count
    ownershipTransferred.hash = event.transaction.hash

    ownershipTransferred.previousOwner = event.params.previousOwner
    ownershipTransferred.newOwner = event.params.newOwner
    ownershipTransferred.save()

    counter.save()
}

export function handleTransfer(event: TransferEvent): void {
    let counter = getCounter("Transfer")

    let transfer = new Transfer(counter.count.toString())
    transfer.index = counter.count
    transfer.hash = event.transaction.hash

    transfer.from = event.params.from
    transfer.to = event.params.to
    transfer.tokenId = event.params.tokenId
    transfer.save()

    counter.save()
}

function getCounter(key: string): Counter {
    let counter = Counter.load(key)
    if (!counter) {
        counter = new Counter(key)
        counter.count = BigInt.fromI32(0)
    }
    counter.count = counter.count.plus(BigInt.fromI32(1))
    return counter
}
