// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DecentraReportSystem
 * @dev Implements gasless transactions (ERC-2771) and immutable evidence logging.
 * All complaints and administrative status changes are recorded on-chain.
 */
contract AnonymousComplaintSystem is ERC2771Context, Ownable {
    
    enum Status { Enrolled, Investigating, Resolved }

    struct Complaint {
        string cid;             // IPFS CID of evidence
        string title;           // Subject of the report
        address reporter;       // Actual address of the reporter (via _msgSender)
        uint256 timestamp;      // Time of filing
        string aiScore;         // Forensic verification score
        Status status;          // Current stage in eSakshya portal
        string govReferenceId;  // Reference ID from government database
    }

    struct Feedback {
        uint8 rating;           // 1-5 Stars
        string category;        // UX, Speed, etc.
        string comment;         // Encrypted or plain text feedback
        uint256 timestamp;
    }

    // Mapping from CID to Complaint details
    mapping(string => Complaint) public complaints;
    
    // Global log of all feedback for transparency
    Feedback[] public feedbacks;

    // Events for off-chain indexing
    event ComplaintFiled(string indexed cid, address indexed reporter, string aiScore);
    event StatusUpdated(string indexed cid, Status newStatus, uint256 timestamp);
    event FeedbackSubmitted(address indexed user, uint8 rating);

    /**
     * @param trustedForwarder Address of the Relayer Forwarder (e.g., Biconomy/OpenZeppelin)
     */
    constructor(address trustedForwarder) 
        ERC2771Context(trustedForwarder) 
        Ownable(msg.sender) 
    {}

    /**
     * @dev Files an anonymous complaint. Relayer pays gas.
     * @param _cid The IPFS Content Identifier of the evidence.
     * @param _title The subject of the report.
     * @param _aiScore The result from the Backend AI forensic analysis.
     */
    function fileComplaint(
        string calldata _cid, 
        string calldata _title, 
        string calldata _aiScore
    ) external {
        require(complaints[_cid].timestamp == 0, "CID already exists on ledger");

        complaints[_cid] = Complaint({
            cid: _cid,
            title: _title,
            reporter: _msgSender(),
            timestamp: block.timestamp,
            aiScore: _aiScore,
            status: Status.Enrolled,
            govReferenceId: ""
        });

        emit ComplaintFiled(_cid, _msgSender(), _aiScore);
    }

    /**
     * @dev Allows eSakshya Admins to update the status of a case.
     * Only the contract owner (Government Authority) can call this.
     */
    function updateComplaintStatus(
        string calldata _cid, 
        Status _newStatus,
        string calldata _govRef
    ) external onlyOwner {
        require(complaints[_cid].timestamp != 0, "Complaint does not exist");
        
        complaints[_cid].status = _newStatus;
        complaints[_cid].govReferenceId = _govRef;

        emit StatusUpdated(_cid, _newStatus, block.timestamp);
    }

    /**
     * @dev Submits anonymous feedback about the platform experience.
     */
    function submitFeedback(
        uint8 _rating,
        string calldata _category,
        string calldata _comment
    ) external {
        require(_rating >= 1 && _rating <= 5, "Invalid rating");

        feedbacks.push(Feedback({
            rating: _rating,
            category: _category,
            comment: _comment,
            timestamp: block.timestamp
        }));

        emit FeedbackSubmitted(_msgSender(), _rating);
    }

    /**
     * @dev Returns total number of feedbacks received.
     */
    function getFeedbackCount() external view returns (uint256) {
        return feedbacks.length;
    }

    // Overrides required by OpenZeppelin's ERC2771Context to resolve the actual sender
    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}