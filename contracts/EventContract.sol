// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract EventContract{
    struct Event{
        address organizer;
        string name;
        uint date;
        uint price;
        uint ticketCount;
        uint ticketRemain;
    }
    mapping(uint=>Event)public events;
     mapping(address=>mapping(uint=>uint))public tickets;
     uint public nextId;
     function createEvent(string memory name,uint date,uint price,uint ticketCount)public{
         require(date>block.timestamp,"time for create event must be greater than present time ");
         require(ticketCount>0,"ticket amount must be greater than zero");
         events[nextId]=Event(msg.sender,name,date,price,ticketCount,ticketCount);
         nextId++;
     }
     function buyTicket(uint id,uint quantity )public payable{
          Event storage _event=events[id];
         require(_event.date!=0,"This event doesnot exist");
         require(_event.date>block.timestamp,"event has already occured");
         require(msg.value==(_event.price*quantity),"Ether is not enough");
         require(_event.ticketRemain>=quantity,"not enough tickets");
         _event.ticketRemain=_event.ticketRemain-quantity;
         tickets[msg.sender][id]+=quantity; 
     
     }
     function transferTicket(uint id,uint quantity,address to) public{
           Event storage _event=events[id];
         require(_event.date!=0,"This event doesnot exist");
         require(_event.date>block.timestamp,"event has already occured");
         require(tickets[msg.sender][id]>=quantity,"You donot have enough ticket");
         tickets[msg.sender][id]-=quantity;
         tickets[to][id]+=quantity;


     }
}