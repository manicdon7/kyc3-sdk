// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYCVerification {
    struct KYCData {
        address signer;
        string name;
        string userId;
        bool verified;
    }

    KYCData[] public kycRecords;
    mapping(address => bool) public hasSubmittedKYC;
    mapping(string => bool) public userIdExists;
    mapping(string => address) public userIdToAddress;

    event KYCVerified(address indexed user, string name, string userId);

    function submitKYC(string memory _name, string memory _userId) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_userId).length > 0, "User ID cannot be empty");
        require(!userIdExists[_userId], "User ID already exists");
        require(!hasSubmittedKYC[msg.sender], "KYC already submitted from this address");

        KYCData memory newKYC = KYCData({
            signer: msg.sender,
            name: _name,
            userId: _userId,
            verified: false
        });

        kycRecords.push(newKYC);

        userIdExists[_userId] = true;
        userIdToAddress[_userId] = msg.sender;
        hasSubmittedKYC[msg.sender] = true;

        emit KYCVerified(msg.sender, _name, _userId);
    }

    function verifyKYC(uint256 _index) external {
        require(_index < kycRecords.length, "Invalid index");

        KYCData storage kycData = kycRecords[_index];
        require(msg.sender == kycData.signer, "Unauthorized");

        kycData.verified = true;
    }

    function getKYCDetails(uint256 _index) external view returns (address, string memory, string memory, bool) {
        require(_index < kycRecords.length, "Invalid index");

        KYCData memory kycData = kycRecords[_index];
        return (kycData.signer, kycData.name, kycData.userId, kycData.verified);
    }

    function getKYCDataBySigner(address _signer) external view returns (KYCData[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < kycRecords.length; i++) {
            if (kycRecords[i].signer == _signer) {
                count++;
            }
        }

        KYCData[] memory signerKYCs = new KYCData[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < kycRecords.length; i++) {
            if (kycRecords[i].signer == _signer) {
                signerKYCs[index] = kycRecords[i];
                index++;
            }
        }
        return signerKYCs;
    }
}
