// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectManagement {
    struct Project {
        uint256 id;
        string name;
        address manager;
        uint256 budget;
        uint256 spent;
        bool completed;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    function createProject(string memory name, uint256 budget) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, name, msg.sender, budget, 0, false);
    }

    function spendFunds(uint256 projectId, uint256 amount) public {
        Project storage project = projects[projectId];
        require(msg.sender == project.manager, "Only manager can spend funds");
        require(project.spent + amount <= project.budget, "Exceeds project budget");
        project.spent += amount;
    }

    function completeProject(uint256 projectId) public {
        Project storage project = projects[projectId];
        require(msg.sender == project.manager, "Only manager can complete project");
        project.completed = true;
    }

    function getProject(uint256 projectId) public view returns (string memory, address, uint256, uint256, bool) {
        Project memory project = projects[projectId];
        return (project.name, project.manager, project.budget, project.spent, project.completed);
    }
}
