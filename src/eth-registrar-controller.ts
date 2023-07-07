import { BigInt } from "@graphprotocol/graph-ts"
import {
    NameRegistered as NameRegisteredEvent,
    NameRenewed as NameRenewedEvent,
    NewPriceOracle as NewPriceOracleEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/templates/ETHRegistrarController/ETHRegistrarController"
import {
    Counter,
    ControllerOwnershipTransferred,
    ControllerNewPriceOracle,
    ControllerNameRenewed,
    ControllerNameRegistered,
} from "../generated/schema"

export function handleNameRegistered(event: NameRegisteredEvent): void {
    let counter = getCounter("ControllerNameRegistered")

    let nameRegistered = new ControllerNameRegistered(counter.count.toString())
    nameRegistered.address = event.address

    nameRegistered.index = counter.count
    nameRegistered.hash = event.transaction.hash

    nameRegistered.name = event.params.name
    nameRegistered.label = event.params.label
    nameRegistered.owner = event.params.owner
    nameRegistered.cost = event.params.cost
    nameRegistered.expires = event.params.expires
    nameRegistered.save()

    counter.save()
}

export function handleNameRenewed(event: NameRenewedEvent): void {
    let counter = getCounter("ControllerNameRenewed")

    let nameRenewed = new ControllerNameRenewed(counter.count.toString())
    nameRenewed.address = event.address

    nameRenewed.index = counter.count
    nameRenewed.hash = event.transaction.hash

    nameRenewed.name = event.params.name
    nameRenewed.label = event.params.label
    nameRenewed.cost = event.params.cost
    nameRenewed.expires = event.params.expires
    nameRenewed.save()

    counter.save()
}

export function handleNewPriceOracle(event: NewPriceOracleEvent): void {
    let counter = getCounter("ControllerNewPriceOracle")

    let newPriceOracle = new ControllerNewPriceOracle(counter.count.toString())
    newPriceOracle.address = event.address

    newPriceOracle.index = counter.count
    newPriceOracle.hash = event.transaction.hash

    newPriceOracle.oracle = event.params.oracle
    newPriceOracle.save()

    counter.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
    let counter = getCounter("ControllerOwnershipTransferred")

    let ownershipTransferred = new ControllerOwnershipTransferred(counter.count.toString())
    ownershipTransferred.address = event.address
    ownershipTransferred.index = counter.count
    ownershipTransferred.hash = event.transaction.hash

    ownershipTransferred.previousOwner = event.params.previousOwner
    ownershipTransferred.newOwner = event.params.newOwner
    ownershipTransferred.save()

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
