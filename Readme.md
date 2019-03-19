# SFTP pattern on Azure using ACI and Pulumi

This repo holds a simple pattern to deploy the following:

- an Azure Resource Group
- an Azure Storage Account
- an Azure Container Instances Group with a single container

## How to deploy

In order to deploy this infrastructure the `pulumi` binary needs to be available on the instance.
A pulumi stack needs to also have been created in the user's pulumi account
A user also needs to run `az login` so that the environment is authenticated to an Azure subscription.

```javascript
npm install
pulumi preview
```

Follow the prompts if required.
If happy with the preview and no errors are obvious, then `pulumi up` will deploy the changes.

## Access to FTP

In the `Pulumi.dev.yaml` file a secret key for `sftpusers` exists. This has a value of `david:david` (`username:password`).
Post deployment users will be able to connect to the ACI's DNS name on port 22 with these credentials.