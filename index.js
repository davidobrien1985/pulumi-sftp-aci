"use strict";
const pulumi = require("@pulumi/pulumi");
const azure = require("@pulumi/azure");

var config = new pulumi.Config("pulumi-azure-ftp-dev");

var region = config.require("region");

var sftpUsers = config.require("sftpusers");

// Create an Azure Resource Group
const resourceGroup = new azure.core.ResourceGroup("resourceGroup", {
  location: region,
  name: "pulumi-sftp"
});

// Create an Azure resource (Storage Account)
const storageAccount = new azure.storage.Account("storage", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  accountTier: "Standard",
  accountReplicationType: "LRS",
});

const aci_share = new azure.storage.Share("aci-share", {
  name: "sftp-share",
  resourceGroupName: resourceGroup.name,
  storageAccountName: storageAccount.name
})


const aci_ftp = new azure.containerservice.Group("aci-sftp", {
  containers: [
    {
      cpu: 1,
      environmentVariables: {
        SFTP_USERS: sftpUsers,
      },
      image: "atmoz/sftp:latest",
      memory: 2,
      name: "sftp",
      ports: [
        {
          port: 22,
          protocol: "TCP",
        }
      ],
      volumes: [{
        mountPath: "/sftpuser/upload",
        name: "sftpvolume",
        readOnly: false,
        shareName: aci_share.name,
        storageAccountKey: storageAccount.primaryAccessKey,
        storageAccountName: storageAccount.name,
      }],
    }
  ],
  dnsNameLabel: "aci-sftp",
  ipAddressType: "public",
  location: resourceGroup.location,
  name: "aci-sftp",
  osType: "Linux",
  resourceGroupName: resourceGroup.name,
  tags: {
    environment: "testing",
  },
});


// Export the connection string for the storage account
exports.connectionString = storageAccount.primaryConnectionString;
exports.containerUri = aci_ftp.fqdn;