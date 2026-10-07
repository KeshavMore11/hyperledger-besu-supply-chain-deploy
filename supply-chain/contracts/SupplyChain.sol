// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum ProductType {
        Mango,
        Apple
    }

    enum Status {
        Created,
        Harvested,
        InTransit,
        AtWarehouse,
        Delivered
    }

    struct Batch {
        uint256 id;
        ProductType product;
        string batchNumber;
        uint256 quantity;
        string currentOwner;
        string location;
        Status status;
        uint256 timestamp;
    }

    uint256 public batchCount;

    mapping(uint256 => Batch) public batches;

    event BatchCreated(
        uint256 indexed batchId,
        string batchNumber,
        string product,
        uint256 quantity
    );

    event BatchTransferred(
        uint256 indexed batchId,
        string newOwner,
        string location,
        string status
    );

    function createBatch(
        bool isMango,
        string memory batchNumber,
        uint256 quantity,
        string memory owner,
        string memory location
    ) public {
        batchCount++;

        batches[batchCount] = Batch(
            batchCount,
            isMango ? ProductType.Mango : ProductType.Apple,
            batchNumber,
            quantity,
            owner,
            location,
            Status.Created,
            block.timestamp
        );

        emit BatchCreated(
            batchCount,
            batchNumber,
            isMango ? "Mango" : "Apple",
            quantity
        );
    }

    function transferBatch(
        uint256 batchId,
        string memory newOwner,
        string memory newLocation,
        Status newStatus
    ) public {
        require(
            batchId > 0 && batchId <= batchCount,
            "Batch does not exist"
        );

        batches[batchId].currentOwner = newOwner;
        batches[batchId].location = newLocation;
        batches[batchId].status = newStatus;
        batches[batchId].timestamp = block.timestamp;

        emit BatchTransferred(
            batchId,
            newOwner,
            newLocation,
            statusToString(newStatus)
        );
    }

    function getBatch(uint256 batchId)
        public
        view
        returns (
            uint256,
            ProductType,
            string memory,
            uint256,
            string memory,
            string memory,
            Status,
            uint256
        )
    {
        require(
            batchId > 0 && batchId <= batchCount,
            "Batch does not exist"
        );

        Batch memory b = batches[batchId];

        return (
            b.id,
            b.product,
            b.batchNumber,
            b.quantity,
            b.currentOwner,
            b.location,
            b.status,
            b.timestamp
        );
    }

    function statusToString(Status status)
        internal
        pure
        returns (string memory)
    {
        if (status == Status.Created) return "Created";
        if (status == Status.Harvested) return "Harvested";
        if (status == Status.InTransit) return "In Transit";
        if (status == Status.AtWarehouse) return "At Warehouse";
        if (status == Status.Delivered) return "Delivered";

        return "Unknown";
    }
}
