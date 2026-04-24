## Plan: Driver Cluster Assignment Update

TL;DR - Convert driver assignment from single orders to cluster-level allocation. Drivers will choose available clusters, the app will assign the driver to the selected cluster, and every pending order in that cluster will be marked as assigned to that driver.

**Steps**
1. Schema & definitions
   - Update `supabase/migrations/20260422151326_add_smart_clusters.sql` to add `driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL` to the `clusters` table.
   - Update `lib/definitions/cluster.ts` to include an optional `driver_id?: string` property.

2. Service layer
   - Add a new cluster assignment method in `lib/services/cluster_service.ts`, e.g. `assignDriverToCluster(supabase, clusterId, driverId)`.
     - Update the `clusters` record with `driver_id`.
     - Update all `orders` rows in that cluster with `status: 'IN_PROGRESS'` and `driver_id` equal to the assigned driver.
   - Add cluster query helpers in `lib/services/cluster_service.ts`:
     - `getAvailableClusters(supabase)` returns clusters with no `driver_id` and pending orders.
     - `getActiveClustersByDriver(supabase, driverId)` returns clusters assigned to a particular driver.
   - Optionally keep existing `OrderService.assignDriver` for backward compatibility but stop using it for driver-facing cluster assignment.

3. Driver UI updates
   - Update `app/(landing)/available/page.tsx` to fetch and display available clusters instead of `OrderService.getPendingOrders`.
     - Display cluster summary information: number of pending orders, centroid or area, and maybe representative addresses.
     - Use the new cluster assignment service method when the driver accepts a cluster.
   - Update `app/(landing)/driver_page_component.tsx` to keep showing active deliveries for the driver, but treat them as orders within the assigned clusters.
     - Optionally surface cluster context in the active deliveries section if helpful.

4. Tests
   - Add or extend tests in `tests/cluster_service.test.ts` for cluster assignment and available cluster queries.
   - Add or extend tests in `tests/order_service.test.ts` if `OrderService` changes to support cluster-based assignment.

**Verification**
1. Run targeted tests for cluster and order services.
2. Verify `/available` shows clusters instead of individual orders.
3. Confirm accepting a cluster assigns the driver to the cluster and updates all pending orders in that cluster to `IN_PROGRESS` with the driver ID.
4. Confirm active driver dashboard remains functional and shows assigned deliveries.

**Decisions**
- Use cluster-level `driver_id` to record assignment and update all cluster orders atomically.
- Driver available view becomes cluster-focused; active dashboard remains order-detail oriented.
- The cluster assignment is exclusive and does not allow single-order assignment for drivers.
